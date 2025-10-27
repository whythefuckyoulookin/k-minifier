import { type INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppConfig } from 'src/config/app.config';

export function setupSwagger(app: INestApplication) {
  const appConfig = app.get(ConfigService).getOrThrow<AppConfig>('app');
  SwaggerModule.setup(appConfig.swagger.path, app,
    () => SwaggerModule.createDocument(app,
      new DocumentBuilder()
        .setTitle('kMinifier')
        .setDescription('API документация')
        .build()
    ),
    appConfig.swagger.options
  );
}