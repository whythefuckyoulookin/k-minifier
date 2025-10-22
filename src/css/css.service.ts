import { Injectable } from "@nestjs/common";
import { transform } from "lightningcss";

@Injectable()
export class CssService {
  public minify(file: Express.Multer.File) {
    let minifyResult = transform({
      filename: 'style.css',
      code: file.buffer,
      minify: true,
      sourceMap: false,
      
    });

    return {
      fileName: file.originalname.split('.').slice(0, -1).join('.') + 'min.css',
      minifyResult
    }
  }
}