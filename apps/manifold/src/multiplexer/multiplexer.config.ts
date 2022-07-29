import { ProcessEnv } from '@census-reworked/nestjs-utils';
import { IsUrl } from 'class-validator';

export class MultiplexerConfig {
  @ProcessEnv('MULTIPLEXER_ENDPOINT')
  @IsUrl({ require_tld: false })
  endpoint: string;
}
