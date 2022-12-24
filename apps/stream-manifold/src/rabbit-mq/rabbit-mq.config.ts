import { ProcessEnv } from '@nanite-systems/utils';

export class RabbitMqConfig {
  @ProcessEnv('RABBITMQ_URL')
  url: string;

  @ProcessEnv('RABBITMQ_STREAM_EXCHANGE')
  streamExchange: string;
}
