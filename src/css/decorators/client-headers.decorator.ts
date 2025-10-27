import { BadRequestException, createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

export interface IClientHeaders {
  platform: string
  login: string
}

export const ClientHeaders = createParamDecorator<unknown, IClientHeaders>(
  (_: unknown, ctx: ExecutionContext) => {
    const headers = ctx.switchToHttp().getRequest<Request>().headers;
    let platform = headers['x-client-platform'];
    let login = headers['x-client-login'];

    if (
      !platform
      || Array.isArray(platform)
      || platform.trim() === ''
      || platform.length > 64
      || !(/^[A-Za-z0-9]+$/.test(platform))
    )
      throw new BadRequestException('x-client-platform не указан или указан некорректно')

    if (
      !login
      || Array.isArray(login)
      || login.trim() === ''
      || login.length > 64
      || !(/^[A-Za-z0-9]+$/.test(login))
    )
      throw new BadRequestException('x-client-login не указан или указан некорректно')

    return { platform, login };
  },
);