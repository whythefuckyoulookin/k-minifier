import { HttpStatus, ParseFilePipeBuilder } from "@nestjs/common";

export const parseCssFilePipe = new ParseFilePipeBuilder()
  .addFileTypeValidator({ fileType: 'text/css', skipMagicNumbersValidation: true })
  .addMaxSizeValidator({ maxSize: 10 * 1024 * 1024 })
  .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY, fileIsRequired: true })