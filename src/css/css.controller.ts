import { BadRequestException, Controller, Headers, Ip, Logger, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { CssService } from './css.service';
import { cssDiskStorage } from 'src/storage/disk.storage';

@Controller('css')
export class CssController {
  private readonly logger = new Logger(CssController.name, { timestamp: true });
  constructor(private readonly cssService: CssService) { }

  @Post('minify')
  @UseInterceptors(FileInterceptor('file',
    {
      storage: cssDiskStorage(),
      limits: { fileSize: 10 * 1024 * 1024, },
      fileFilter: (_, file, cb) => {
        if (!file.originalname.match(/\.(css)$/))
          return cb(new BadRequestException('Invalid file type'), false);
        cb(null, true);
      },
    }
  ))
  uploadFile(@Headers('x-client-site') clientSite: string, @UploadedFile() file: Express.Multer.File, @Res() res: Response, @Ip() ip: string) {
    const { fileName, minifyResult } = this.cssService.minify(file)
    this.logger.warn(`X-Client-Site not available for ip: ${ip}`)
    res.setHeader('Content-Type', 'text/css');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    return res.send(minifyResult.code);
  }
}
