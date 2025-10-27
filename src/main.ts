import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config/app.config';
import { Logger } from '@nestjs/common';
import helmet from 'helmet';
import { setupSwagger } from './utils/setup-swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig = app.get(ConfigService).get<AppConfig>('app')
  if (!appConfig)
    throw new Error("appConfig не загружен")

  app.use(helmet())
  app.setGlobalPrefix('api')
  app.enableShutdownHooks();
  setupSwagger(app)

  const appPort = appConfig.port
  await app.listen(appPort);
  Logger.log(`Приложение запущено на порту ${appPort}`, bootstrap.name)

  const signals = ['SIGTERM', 'SIGINT'];
  signals.forEach(signal => {
    process.on(signal, async () => {
      Logger.log(`Получен сигнал ${signal}, начинаем graceful shutdown...`, 'Bootstrap');
      try {
        await app.close();
        Logger.log('Приложение успешно остановлено', 'Bootstrap');
        process.exit(0);
      } catch (error) {
        Logger.error('Ошибка при остановке приложения', error, 'Bootstrap');
        process.exit(1);
      }
    });
  });
}
bootstrap();
