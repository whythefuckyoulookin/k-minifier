import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [LoggerModule],
  providers: [{ provide: APP_INTERCEPTOR, useClass: LoggingInterceptor }],
})
export class SharedModule { }