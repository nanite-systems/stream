import { ProcessEnv } from '@nanite-systems/utils';
import { randomUUID } from 'crypto';

export class PublisherConfig {
  @ProcessEnv('COLLECTOR_ID')
  collectorId = randomUUID();
}
