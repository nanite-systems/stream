import { ProcessEnv, BoolTransform } from '@nanite-systems/utils';

export class RabbitMqConfig {
  @ProcessEnv('RABBITMQ_URL')
  url: string;

  @ProcessEnv('RABBITMQ_COLLECTOR_EXCHANGE_NAME')
  collectorExchange: string;

  @ProcessEnv('RABBITMQ_COLLECTOR_EXCHANGE_TYPE')
  collectorExchangeType = 'fanout';

  @ProcessEnv('RABBITMQ_COLLECTOR_EXCHANGE_DURABLE')
  @BoolTransform()
  collectorExchangeDurable = false;

  @ProcessEnv('RABBITMQ_COLLECTOR_EXCHANGE_AUTO_DELETE')
  @BoolTransform()
  collectorExchangeAutoDelete = false;
}
