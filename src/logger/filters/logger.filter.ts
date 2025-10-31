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
        reqId: request['requestId'],
        err: {
          code: exception.getStatus(),
          message: exception.message,
          stack: exception.stack?.replaceAll(join(process.cwd()), ''),
          name: exception.name,
        }
      }
    );
    ctx
      .getResponse<Response>()
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: exception.message,
        error: {
          cause: exception.cause,
          name: exception.name,
          // @ts-ignore
          ...(exception.options && exception.options.description &&
          {
            description: {
              // @ts-ignore
              loc: exception.options.description.loc,
              // @ts-ignore
              data: exception.options.description.data
            }
          }
          )
        }
      });
  }
}