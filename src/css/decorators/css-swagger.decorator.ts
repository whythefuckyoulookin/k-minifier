import { applyDecorators } from "@nestjs/common"
import { ApiBody, ApiConsumes, ApiHeaders, ApiQuery, ApiResponse } from "@nestjs/swagger"
import { CssFileDto } from "../dto/css-file.dto"

export const ApiMinify = () => {
  return applyDecorators(
    ApiBody({
      description: 'Тело запроса',
      required: true,
      type: CssFileDto,
    }),
    ApiConsumes('multipart/form-data'),
    ApiHeaders([{
      name: 'x-client-platform',
      description: 'Название платформы',
      required: true,
      example: 'kzla'
    }, {
      name: 'x-client-login',
      description: 'Логин сайта',
      required: true,
      example: 'kozadereza'
    }]),
    ApiResponse({
      status: 201,
      description: 'Возвращает минифициорованный css-файл'
    })
  )
}

export const ApiBackupList = () => {
  return applyDecorators(
    ApiHeaders([{
      name: 'x-client-platform',
      description: 'Название платформы',
      required: true,
      example: 'kzla'
    }, {
      name: 'x-client-login',
      description: 'Логин сайта',
      required: true,
      example: 'kozadereza'
    }])
  )
}

export const ApiBackup = () => {
  return applyDecorators(
    ApiHeaders([{
      name: 'x-client-platform',
      description: 'Название платформы',
      required: true,
      example: 'kzla'
    }, {
      name: 'x-client-login',
      description: 'Логин сайта',
      required: true,
      example: 'kozadereza'
    }]),
    ApiQuery({
      name: 't',
      description: "Unix-метка бэкапа",
      example: "1761310854989"
    })
  )
}