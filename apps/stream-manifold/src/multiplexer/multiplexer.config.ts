import { ProcessEnv } from '@nanite-systems/utils';

export class MultiplexerConfig {
  @ProcessEnv('MULTIPLEXER_ENDPOINT')
  endpoint: string;
}
