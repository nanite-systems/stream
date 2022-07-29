import { ProcessEnv } from '@census-reworked/nestjs-utils';
import { Transform } from 'class-transformer';
import { LogLevel } from '@nestjs/common';
import { IsIn } from 'class-validator';

export class AppConfig {
  @ProcessEnv('LOG_LEVELS')
  @IsIn(['verbose', 'debug', 'log', 'warn', 'error'], { each: true })
  @Transform(({ value }) => value?.split(','))
  logLevels: LogLevel[] = ['log', 'warn', 'error'];
}
