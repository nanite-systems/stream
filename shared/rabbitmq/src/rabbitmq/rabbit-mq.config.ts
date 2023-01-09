import { ProcessEnv } from '@nss/utils';

export class RabbitMqConfig {
  @ProcessEnv('RABBITMQ_URL')
  readonly url: string;
}
