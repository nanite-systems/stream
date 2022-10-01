import { ProcessEnv } from '@census-reworked/nestjs-utils';
import { Transform } from 'class-transformer';
import { LogLevel } from '@nestjs/common';
import { IsIn, Max, Min } from 'class-validator';

export class AppConfig {
  @ProcessEnv('APP_PORT')
  @Min(1)
  @Max(65535)
  @Transform(({ value }) => Number.parseInt(value, 10))
  port = 3000;

  @ProcessEnv('LOG_LEVELS')
  @IsIn(['verbose', 'debug', 'log', 'warn', 'error'], { each: true })
  @Transform(({ value }) => value?.split(','))
  logLevels: LogLevel[] = ['log', 'warn', 'error'];
}
