import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from '../logger.service';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly loggerService: LoggerService) {
    this.loggerService.setContext(LoggerInterceptor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(() => {
        const request = context.switchToHttp().getRequest<Request>();
        const response = context.switchToHttp().getResponse<Response>();
        this.loggerService.log(
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
            reqId: request['requestId']
          }
        );
      }),
    );
  }
}