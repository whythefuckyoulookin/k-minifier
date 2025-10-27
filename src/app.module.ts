import { Module } from '@nestjs/common';
import { CssModule } from './css/css.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { cssConfig } from './config/css.config';
import { filesConfig } from './config/files.config';
import { appConfig } from './config/app.config';
import { LoggerInterceptor } from './logger/interceptors/logger.interceptor';
import { LoggerModule } from './logger/logger.module';
import { loggerConfig } from './config/logger.config';

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
  ],
})
export class AppModule { }
