import { HttpStatus, ParseFilePipeBuilder } from "@nestjs/common";
import { MAX_CSS_FILE_SIZE } from "src/consts/file";

export const CSS_PARSE_FILE_PIPE = new ParseFilePipeBuilder()
  .addFileTypeValidator({ fileType: 'text/css', skipMagicNumbersValidation: true })
  .addMaxSizeValidator({ maxSize: MAX_CSS_FILE_SIZE })
  .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY, fileIsRequired: true })