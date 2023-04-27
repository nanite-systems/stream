import { DynamicModule, Module, ModuleMetadata } from '@nestjs/common';
import { createLogger, format, transports } from 'winston';
import { Logger } from './logger';
import { BASE_LOGGER, LOGGER_OPTIONS } from './constants';
import { prettyPrint } from './utils/pretty-print';
import { LogLevel } from './types/log-level.type';

export interface LoggerModuleOptions {
  pretty: boolean;
  level: LogLevel;
}

export interface LoggerModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  global?: boolean;
  useFactory: (
    ...args: any[]
  ) => Promise<LoggerModuleOptions> | LoggerModuleOptions;
  inject?: any[];
}

@Module({})
export class LoggerModule {
  static forRootAsync(options: LoggerModuleAsyncOptions): DynamicModule {
    return {
      module: LoggerModule,
      global: options.global,
      imports: options.imports,
      providers: [
        {
          provide: LOGGER_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject,
        },
        {
          provide: BASE_LOGGER,
          useFactory: (options: LoggerModuleOptions) =>
            createLogger({
              level: options.level,
              levels: {
                error: 0,
                warn: 1,
                info: 2,
                debug: 3,
                verbose: 4,
              },
              format: format.combine(
                format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                ...(options.pretty
                  ? [format.colorize(), prettyPrint()]
                  : [format.json()]),
              ),
              transports: [new transports.Console()],
            }),
          inject: [LOGGER_OPTIONS],
        },
        Logger,
      ],
      exports: [Logger],
    };
  }
}
