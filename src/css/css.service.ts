import { Inject, Injectable, NotFoundException, StreamableFile } from "@nestjs/common";
import { transform } from "lightningcss";
import { basename, extname } from "path";
import { type CssConfig, cssConfig } from "src/config/css.config";
import { FilesService } from "src/files/files.service";
import { IClientHeaders } from "src/css/decorators/client-headers.decorator";
import { randomUUID } from "crypto";

@Injectable()
export class CssService {
  constructor(
    @Inject(cssConfig.KEY)
    private readonly config: CssConfig,
    private readonly filesService: FilesService
  ) { }

  async minifyCss(file: Express.Multer.File, client: IClientHeaders) {
    const fileExt = extname(file.originalname)
    const fileName = basename(file.originalname, fileExt)
    const minifiedCssPath = `${this.config.minifiedCssDest}/${this.filesService.getFileHash(file.buffer)}.min${fileExt}`

    let minifiedCss = await this.filesService.getFile(minifiedCssPath)

    if (!minifiedCss) {
      let minifyResult = transform({
        ...this.config.lightningcssOptions,
        filename: `${Date.now()}.tmp.${file.filename}`,
        code: file.buffer,
      });
      minifiedCss = Buffer.from(minifyResult.code)
      await this.filesService.saveFile(minifiedCss, minifiedCssPath)
    }

    await this.filesService.saveFile(
      file.buffer,
      `${client.platform}/${client.login}/${Date.now()}-${randomUUID()}.${file.originalname}`
    )

    return new StreamableFile(minifiedCss, {
      type: 'text/css',
      disposition: `attachment; filename="${fileName}.min${fileExt}"`
    })
  }

  async getBackupList(client: IClientHeaders) {
    const backupList = await this.filesService.getDir(`${client.platform}/${client.login}`)
    return backupList ? backupList
      .map(backup => backup.split('.')[0])
      .reduce((prev, timestamp) => ({ ...prev, ...{ [new Date(Number(timestamp)).toISOString()]: timestamp } }), {})
      : []
  }

  async getBackupFile(client: IClientHeaders, timestamp: string) {
    const backupList = await this.filesService.getDir(`${client.platform}/${client.login}`)
    
    const backupFileName = backupList ? backupList.find(backup => backup.includes(timestamp)) : undefined
    if (!backupFileName)
      throw new NotFoundException()
    
    const backupFileBuffer = await this.filesService.getFile(`${client.platform}/${client.login}/${backupFileName}`)
    if (!backupFileBuffer)
      throw new NotFoundException()

    return new StreamableFile(backupFileBuffer, {
      type: 'text/css',
      disposition: `attachment; filename="${backupFileName.split('.').slice(1).join('.')}"`
    })
  }
}