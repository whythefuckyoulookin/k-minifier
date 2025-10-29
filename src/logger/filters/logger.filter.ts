import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { LoggerService } from '../logger.service';
import { join } from 'path';

@Catch(HttpException)
export class AllHttpExceptionsFilter implements ExceptionFilter {
  constructor(private readonly loggerService: LoggerService) {
    this.loggerService.setContext(AllHttpExceptionsFilter.name);
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    this.loggerService.error(
      {
        client: {
          platform: request.header('x-client-platform'),
          login: request.header('x-client-login'),
          ip: request.ip
        }
      },
      {
        req: {
          method: request.method,
          endpoint: request.url,
          content: {
            length: request.header('content-length'),
            type: request.header('content-type'),
          },
          query: request.query
        },
        resStatus: response.statusCode,
        reqId: request['requestId'],
        err: {
          code: exception.getStatus(),
          message: exception.message,
          stack: exception.stack?.replaceAll(join(process.cwd()), ''),
          name: exception.name,
        }
      }
    );

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}