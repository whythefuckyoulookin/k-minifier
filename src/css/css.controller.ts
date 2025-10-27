import { Controller, Get, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CssService } from './css.service';
import { ClientHeaders, type IClientHeaders } from './decorators/client-headers.decorator';
import { CSS_PARSE_FILE_PIPE } from './pipes/parse-css-file.pipe';
import { ApiBackup, ApiBackupList, ApiMinify } from './decorators/css-swagger.decorator';

@Controller('css')
export class CssController {
  constructor(private readonly cssService: CssService) { }

  @ApiMinify()
  @Post('minify')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @ClientHeaders() client: IClientHeaders,
    @UploadedFile(CSS_PARSE_FILE_PIPE) file: Express.Multer.File,
  ) {
    return this.cssService.minifyCss(file, client)
  }

  @ApiBackupList()
  @Get('backup/list')
  getBackupList(@ClientHeaders() client: IClientHeaders) {
    return this.cssService.getBackupList(client)
  }

  @ApiBackup()
  @Get('backup')
  getBackupFile(
    @ClientHeaders() client: IClientHeaders,
    @Query('t') timestamp: string
  ) {
    return this.cssService.getBackupFile(client, timestamp)
  }
}
