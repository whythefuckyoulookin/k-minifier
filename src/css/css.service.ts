import { Injectable, InternalServerErrorException } from "@nestjs/common";
// import { createHash } from "crypto";
import { readFileSync } from "fs";
import { transform } from "lightningcss";

@Injectable()
export class CssService {
  public minify(file: Express.Multer.File) {
    const fileBuffer = readFileSync(file.path)
    // const sha256Hash = createHash('sha256')
    //   .update(fileBuffer)
    //   .digest('hex');

    // console.log('SHA-256:', sha256Hash);
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