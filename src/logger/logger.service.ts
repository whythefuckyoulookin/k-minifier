import { Inject, Injectable, Scope } from '@nestjs/common';
import { type LoggerConfig, loggerConfig } from 'src/config/logger.config';
import { createLogger, Logger } from 'winston';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService {
  private context?: string;
  private logger: Logger;

  constructor(
    @Inject(loggerConfig.KEY)
    private readonly config: LoggerConfig
  ) {
    this.logger = createLogger({ ...this.config });
  }

  public setContext(context: string) {
    this.context = context;
  }

  error(ctx: Record<string, any>, meta?: Record<string, any>) {
    return this.logger.error({
      contextName: this.context,
      ctx,
      timestamp: new Date().toISOString(),
      ...meta,
    });
  }

  warn(ctx: Record<string, any>, meta?: Record<string, any>) {
    return this.logger.warn({
      contextName: this.context,
      ctx,
      timestamp: new Date().toISOString(),
      ...meta,
    });
  }

  debug(ctx: Record<string, any>, meta?: Record<string, any>) {
    return this.logger.debug({
      contextName: this.context,
      ctx,
      timestamp: new Date().toISOString(),
      ...meta,
    });
  }

  verbose(ctx: Record<string, any>, meta?: Record<string, any>) {
    return this.logger.verbose({
      contextName: this.context,
      ctx,
      timestamp: new Date().toISOString(),
      ...meta,
    });
  }

  log(ctx: Record<string, any>, meta?: Record<string, any>) {
    return this.logger.info({
      contextName: this.context,
      ctx,
      timestamp: new Date().toISOString(),
      ...meta,
    });
  }
}