import { ProcessEnv } from '@nss/utils';
import { randomUUID } from 'crypto';

export class PublisherConfig {
  @ProcessEnv('APP_ID')
  readonly appId = randomUUID();

  @ProcessEnv('STREAM_EXCHANGE_NAME')
  readonly exchangeName = 'nss-stream';
}
