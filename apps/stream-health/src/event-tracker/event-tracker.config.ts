import { ProcessEnv } from '@nanite-systems/utils';

export class EventTrackerConfig {
  @ProcessEnv('EVENT_EXCHANGE')
  readonly eventExchange: string;

  @ProcessEnv('HEALTH_QUEUE')
  readonly healthQueue: string;
}
