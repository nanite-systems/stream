import { ProcessEnv } from '@nss/utils';

export class IngressConfig {
  @ProcessEnv('STREAM_EXCHANGE_NAME')
  readonly exchangeName = 'nss-stream';
}
