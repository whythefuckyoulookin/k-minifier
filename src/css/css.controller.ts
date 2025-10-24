import { Controller, Get, Logger, NotFoundException, Post, Query, StreamableFile, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CssService } from './css.service';
import { ClientHeaders, type IClientHeaders } from 'src/shared/decorators/client-headers.decorator';
import { parseCssFilePipe } from './pipes/parse-css-file.pipe';
import { FilesService } from 'src/files/files.service';
import { basename, extname, join } from 'path';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { ApiBody, ApiConsumes, ApiHeaders, ApiProperty, ApiQuery, ApiResponse } from '@nestjs/swagger';

class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary', description: "Css-файл, который нужно минифицировать" })
  file: File;
}

@Controller('css')
export class CssController {
  private readonly logger = new Logger(CssController.name);

  constructor(
    private readonly cssService: CssService,
    private readonly filesService: FilesService,
  ) { }

  @Post('minify')
  @ApiHeaders([
    { name: 'x-client-platform', description: 'Название платформы', required: true, example: 'kzla' },
    { name: 'x-client-login', description: 'Логин сайта', required: true, example: 'kozadereza' }
  ])
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Тело запроса',
    required: true,
    type: FileUploadDto,
  })
  @ApiResponse({ status: 201, description: 'Возвращает минифициорованный css-файл' })
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @ClientHeaders() client: IClientHeaders,
    @UploadedFile(parseCssFilePipe) file: Express.Multer.File,
  ) {
    const fileExt = extname(file.originalname)
    const fileName = basename(file.originalname, fileExt)
    const minifiedCssPath = `__minified__/${this.filesService.getFileHash(file.buffer)}.min${fileExt}`

    let minifiedCss = this.filesService.getFile(minifiedCssPath)

    if (!minifiedCss) {
      this.logger.log("minified")
      minifiedCss = Buffer.from(this.cssService.minify(file))
      this.filesService.saveFile(Buffer.from(minifiedCss), minifiedCssPath)
    }

    if (client.login && client.platform) {
      this.filesService.saveFile(
        file.buffer,
        `${client.platform}/${client.login}/${Date.now()}.${file.originalname}`
      )
    }

    return new StreamableFile(minifiedCss, {
      type: 'text/css',
      disposition: `attachment; filename="${fileName}.min${fileExt}"`
    })
  }

  @Get('backup/list')
  @ApiHeaders([
    { name: 'x-client-platform', description: 'Название платформы', required: true, example: 'kzla' },
    { name: 'x-client-login', description: 'Логин сайта', required: true, example: 'kozadereza' }
  ])
  getBackupsList(@ClientHeaders() client: IClientHeaders) {
    if (!client.login || !client.platform)
      throw new NotFoundException()

    const backupsPath = join(process.cwd(), 'uploads', client.platform, client.login)
    if (!existsSync(backupsPath))
      return []
    const backupsList = readdirSync(backupsPath)
    return backupsList
      .map(backup => backup.split('.')[0])
      .reduce((prev, timestamp) => ({ ...prev, ...{ [new Date(Number(timestamp)).toISOString()]: timestamp } }), {})
  }

  @Get('backup')
  @ApiQuery({ name: 't', description: "Unix-метка бэкапа", example: "1761310854989" })
  @ApiHeaders([
    { name: 'x-client-platform', description: 'Название платформы', required: true, example: 'kzla' },
    { name: 'x-client-login', description: 'Логин сайта', required: true, example: 'kozadereza' }
  ])
  getBackupFile(
    @ClientHeaders() client: IClientHeaders,
    @Query('t') timestamp: string
  ) {
    if (!client.login || !client.platform)
      throw new NotFoundException()

    const backupsPath = join(process.cwd(), 'uploads', client.platform, client.login)
    if (!existsSync(backupsPath))
      throw new NotFoundException()

    const backups = readdirSync(backupsPath)
    if (!backups || !backups.length)
      throw new NotFoundException()

    const backupFileName = backups.find(backup => backup.includes(timestamp))
    if (!backupFileName)
      throw new NotFoundException()

    const backupFileBuffer = readFileSync(join(backupsPath, backupFileName))
    if (!backupFileBuffer)
      throw new NotFoundException()

    return new StreamableFile(backupFileBuffer, {
      type: 'text/css',
      disposition: `attachment; filename="${backupFileName.split('.').slice(1).join('.')}"`
    })
  }
}
