import { ProcessEnv } from '@census-reworked/nestjs-utils';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class RabbitMqConfig {
  @ProcessEnv('RABBITMQ_URL')
  @IsUrl({ protocols: ['amqp'], require_tld: false })
  url: string;

  @ProcessEnv('RABBITMQ_COLLECTOR_EXCHANGE')
  @IsNotEmpty()
  collectorExchange: string;

  @ProcessEnv('RABBITMQ_STREAM_EXCHANGE')
  @IsNotEmpty()
  streamExchange: string;
}
