import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { FastifyReply } from 'fastify';

@Catch()
export class SimpleFormatFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    if (exception instanceof HttpException) {
      host
        .switchToHttp()
        .getResponse<FastifyReply>()
        .code(exception.getStatus())
        .send(`${exception.getStatus()} ${this.formatName(exception.name)}`);
    } else {
      host
        .switchToHttp()
        .getResponse<FastifyReply>()
        .code(HttpStatus.BAD_REQUEST)
        .send(`${HttpStatus.BAD_REQUEST} Bad Request`);
    }
  }

  private formatName(name: string): string {
    return name
      .split(/(?=[A-Z])/)
      .slice(0, -1)
      .join(' ');
  }
}
