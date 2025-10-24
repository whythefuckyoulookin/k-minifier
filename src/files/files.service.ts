import { Injectable } from "@nestjs/common";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { createHash } from "crypto";

@Injectable()
export class FilesService {
  private readonly baseDestPath: string

  constructor() {
    this.baseDestPath = join(process.cwd(), 'uploads')
    this.initializeEnvironment()
  }

  private initializeEnvironment() {
    if (!existsSync(this.baseDestPath)) {
      mkdirSync(this.baseDestPath, { recursive: true })
    }
  }

  public saveFile(buffer: Buffer, path: string) {
    const destPath = join(this.baseDestPath, path)
    if (!existsSync(dirname(destPath)))
      mkdirSync(dirname(destPath), { recursive: true })
    writeFileSync(join(destPath), buffer)
  }

  public getFile(path: string) {
    const filePath = join(this.baseDestPath, path)
    return existsSync(filePath) ? readFileSync(filePath) : null
  }

  public getFileHash(fileBuffer: Buffer) {
    return createHash('sha256').update(fileBuffer).end().digest('hex')
  }
}