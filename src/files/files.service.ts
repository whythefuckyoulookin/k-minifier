import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { dirname, join } from "path";
import { createHash } from "crypto";
import { type FilesConfig, filesConfig } from "src/config/files.config";
import { access, constants, mkdir, readdir, readFile, writeFile } from "fs/promises";

@Injectable()
export class FilesService {
  private readonly baseDestPath: string

  constructor(
    @Inject(filesConfig.KEY)
    private readonly config: FilesConfig
  ) {
    this.baseDestPath = join(process.cwd(), this.config.uploadDest)
    this.initializeEnvironment()
  }

  private async initializeEnvironment() {
    try {
      await access(this.baseDestPath, constants.F_OK)
    } catch (err) {
      await mkdir(this.baseDestPath, { recursive: true })
    }
  }

  async saveFile(buffer: Buffer, path: string) {
    try {
      const destPath = join(this.baseDestPath, path)
      await mkdir(dirname(destPath), { recursive: true })
      await writeFile(destPath, buffer)
    } catch (err) {
      throw new InternalServerErrorException('Ошибка при попытке сохранения файла', { cause: err })
    }
  }

  async getFile(path: string) {
    try {
      const filePath = join(this.baseDestPath, path)
      return await readFile(filePath)
    } catch (err) {
      if (err.code === 'ENOENT') {
        return undefined;
      }
      throw new InternalServerErrorException('Ошибка при попытке получения файла', { cause: err })
    }
  }

  getFileHash(fileBuffer: Buffer) {
    return createHash(this.config.hashAlgorithm).update(fileBuffer).end().digest('hex')
  }

  async getDir(path: string) {
    try {
      const dirPath = join(this.baseDestPath, path)
      return await readdir(dirPath)
    } catch (err) {
      if (err.code === 'ENOENT') {
        return undefined;
      }
      throw new InternalServerErrorException('Ошибка при попытке чтения папки', { cause: err })
    }
  }
}