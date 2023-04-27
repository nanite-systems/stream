import { Inject, Injectable, LoggerService } from '@nestjs/common';
import winston from 'winston';
import { BASE_LOGGER } from './constants';

@Injectable()
export class Logger implements LoggerService {
  constructor(@Inject(BASE_LOGGER) private readonly logger: winston.Logger) {
    this.verbose = this.createLogFunc('verbose');
    this.debug = this.createLogFunc('debug');
    this.log = this.createLogFunc('info');
    this.warn = this.createLogFunc('warn');
    this.error = this.createLogFunc('error');
  }

  private createLogFunc(
    level: string,
  ): (
    messageOrError: string | Error,
    metadataOrContext: object | string,
    context?: string,
  ) => void {
    return (messageOrError, metadataOrContext, context) => {
      if (messageOrError instanceof Error) {
        this.logger.log({
          level,
          message: messageOrError.message,
          stack: messageOrError.stack,
          context: metadataOrContext,
        });
      } else if (typeof metadataOrContext != 'string') {
        this.logger.log({
          level,
          message: messageOrError,
          metadata: metadataOrContext,
          context,
        });
      } else {
        this.logger.log({
          level,
          message: messageOrError,
          context: metadataOrContext,
        });
      }
    };
  }

  verbose(message: string, context?: string): void;
  verbose(message: string, metadata: object, context?: string): void;
  verbose() {}

  debug(message: string, context?: string): void;
  debug(message: string, metadata: object, context?: string): void;
  debug() {}

  log(message: string, context?: string): void;
  log(message: string, metadata: object, context?: string): void;
  log() {}

  warn(err: Error, context?: string);
  warn(message: string, context?: string): void;
  warn(message: string, metadata: object, context?: string): void;
  warn() {}

  error(err: Error, context?: string);
  error(message: string, context?: string): void;
  error(message: string, metadata: object, context?: string): void;
  error() {}
}
