import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { readFileSync } from "fs";
import { transform } from "lightningcss";

@Injectable()
export class CssService {
  public minify(file: Express.Multer.File) {
    const fileBuffer = readFileSync(file.path)
    if (!fileBuffer)
      throw new InternalServerErrorException("Ошибка при минификации css")

    let minifyResult = transform({
      filename: 'style.css',
      code: fileBuffer,
      minify: true,
      sourceMap: false,
    });

    return {
      fileName: file.originalname.split('.').slice(0, -1).join('.') + '.min.css',
      minifyResult
    }
  }
}