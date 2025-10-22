import { Controller, Headers, Logger, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { CssService } from './css.service';
import { v4 as uuidv4 } from 'uuid'

@Controller('css')
export class CssController {
  private readonly logger = new Logger(CssController.name, { timestamp: true });
  constructor(private readonly cssService: CssService) { }

  @Post('minify')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@Headers('x-client-site') clientSite: string, @UploadedFile() file: Express.Multer.File, @Res() res: Response) {
    const { fileName, minifyResult } = this.cssService.minify(file)
    if (!clientSite) {
      this.logger.warn("x-client-site n/a uuidv4 was generated for css file: " + uuidv4())
    }
    res.setHeader('Content-Type', 'text/css');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    return res.send(minifyResult.code);
  }
}
