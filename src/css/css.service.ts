import { Injectable } from "@nestjs/common";
import { transform } from "lightningcss";

@Injectable()
export class CssService {
  public minify(file: Express.Multer.File) {
    let minifyResult = transform({
      filename: `${Date.now()}.tmp.${file.filename}`,
      code: file.buffer,
      minify: true,
      sourceMap: false,
    });
    return minifyResult.code
  }
}