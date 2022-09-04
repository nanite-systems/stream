import { ProcessEnv } from '@census-reworked/nestjs-utils';
import { IsBoolean, IsNotEmpty, IsUrl } from 'class-validator';
import { BoolTransform } from '../utils/transformers.decorators';

export class RabbitMqConfig {
  @ProcessEnv('RABBITMQ_URL')
  @IsUrl({ protocols: ['amqp'], require_tld: false })
  url: string;

  @ProcessEnv('RABBITMQ_COLLECTOR_EXCHANGE_NAME')
  @IsNotEmpty()
  collectorExchange: string;

  @ProcessEnv('RABBITMQ_COLLECTOR_EXCHANGE_TYPE')
  @IsNotEmpty()
  collectorExchangeType = 'fanout';

  @ProcessEnv('RABBITMQ_COLLECTOR_EXCHANGE_DURABLE')
  @IsBoolean()
  @BoolTransform()
  collectorExchangeDurable = false;

  @ProcessEnv('RABBITMQ_COLLECTOR_EXCHANGE_AUTO_DELETE')
  @IsBoolean()
  @BoolTransform()
  collectorExchangeAutoDelete = false;
}
