import { ProcessEnv } from '@census-reworked/nestjs-utils';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class StreamConfig {
  @ProcessEnv('LOG_HEADERS')
  @IsNotEmpty({ each: true })
  @Transform(({ value }) => value?.split(','))
  readonly logHeaders: string[] = [];
}
