/**
 * Точка входа приложения
 * @author Me
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * 
 * @description точка входа приложения
 * @returns {Promise<void>}
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  SwaggerModule.setup(
    'swagger',
    app,
    () => SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('kMinifier')
        .setDescription('API документация')
        .build()
    ), {
    yamlDocumentUrl: 'swagger/yaml',
    customSiteTitle: "korzilla/api"
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
