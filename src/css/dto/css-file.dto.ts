import { ApiProperty } from "@nestjs/swagger";

export class CssFileDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: "Css-файл, который нужно минифицировать"
  })
  file: File;
}
