import { ExecutionContext, Inject, Injectable, Scope } from '@nestjs/common';
import { type LoggerConfig, loggerConfig } from 'src/config/logger.config';
import winston, { createLogger, Logger, transports } from 'winston';
import "winston-daily-rotate-file"

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService {
  private context?: string;
  private logger: Logger;

  constructor(
    @Inject(loggerConfig.KEY)
    private readonly config: LoggerConfig
  ) {
    this.logger = createLogger({
      ...this.config,
      transports: [new transports.DailyRotateFile({
        filename: 'application-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        level: 'info',
        maxFiles: '30d',
        dirname: 'logs',
      })],
    });
  }

  public setContext(context: string): void {
    this.context = context;
  }

  error(
    ctx: ExecutionContext,
    message: string,
    meta?: Record<string, any>,
  ): Logger {
    const timestamp = new Date().toISOString();

    return this.logger.error({
      message,
      contextName: this.context,
      ctx,
      timestamp,
      ...meta,
    });
  }

  warn(
    ctx: ExecutionContext,
    message: string,
    meta?: Record<string, any>,
  ): Logger {
    const timestamp = new Date().toISOString();

    return this.logger.warn({
      message,
      contextName: this.context,
      ctx,
      timestamp,
      ...meta,
    });
  }

  debug(
    ctx: ExecutionContext,
    message: string,
    meta?: Record<string, any>,
  ): Logger {
    const timestamp = new Date().toISOString();

    return this.logger.debug({
      message,
      contextName: this.context,
      ctx,
      timestamp,
      ...meta,
    });
  }

  verbose(
    ctx: ExecutionContext,
    message: string,
    meta?: Record<string, any>,
  ): Logger {
    const timestamp = new Date().toISOString();

    return this.logger.verbose({
      message,
      contextName: this.context,
      ctx,
      timestamp,
      ...meta,
    });
  }

  log(
    ctx: ExecutionContext | undefined,
    message: string,
    meta?: Record<string, any>,
  ): Logger {
    const timestamp = new Date().toISOString();

    return this.logger.info({
      message,
      contextName: this.context,
      ctx,
      timestamp,
      ...meta,
    });
  }
}