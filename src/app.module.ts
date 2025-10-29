import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CssModule } from './css/css.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { cssConfig } from './config/css.config';
import { filesConfig } from './config/files.config';
import { appConfig } from './config/app.config';
import { LoggerInterceptor } from './logger/interceptors/logger.interceptor';
import { LoggerModule } from './logger/logger.module';
import { loggerConfig } from './config/logger.config';
import { RequestIdMiddleware } from './middlewares/request-id.middleware';
import { AllHttpExceptionsFilter } from './logger/filters/logger.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, cssConfig, filesConfig, loggerConfig]
    }),
    LoggerModule,
    CssModule
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: LoggerInterceptor },
    { provide: APP_FILTER, useClass: AllHttpExceptionsFilter }
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*path')
  }
}
