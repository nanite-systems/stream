import { ProcessEnv } from '@nanite-systems/utils';

export class RabbitMqConfig {
  @ProcessEnv('RABBITMQ_URL')
  readonly url: string;
}
