import { ProcessEnv } from '@nanite-systems/utils';
import { Transform } from 'class-transformer';

export class StreamConfig {
  @ProcessEnv('LOG_HEADERS')
  @Transform(({ value }) => value?.split(','))
  readonly logHeaders: string[] = [];
}
