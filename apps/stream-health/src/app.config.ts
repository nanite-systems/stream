import { ProcessEnv } from '@nss/utils';
import { Transform } from 'class-transformer';
import { LogLevel } from '@nestjs/common';

export class AppConfig {
  @ProcessEnv('APP_PORT')
  @Transform(({ value }) => parseInt(value, 10))
  port = 3000;

  @ProcessEnv('LOG_LEVELS')
  @Transform(({ value }) => value?.split(','))
  logLevels: LogLevel[] = ['log', 'warn', 'error'];
}
