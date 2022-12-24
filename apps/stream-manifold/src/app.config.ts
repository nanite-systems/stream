import { ProcessEnv } from '@nanite-systems/utils';
import { Transform } from 'class-transformer';
import { LogLevel } from '@nestjs/common';

export class AppConfig {
  @ProcessEnv('APP_PORT')
  @Transform(({ value }) => Number.parseInt(value, 10))
  port = 3000;

  @ProcessEnv('LOG_LEVELS')
  @Transform(({ value }) => value?.split(','))
  logLevels: LogLevel[] = ['log', 'warn', 'error'];
}
