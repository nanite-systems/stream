import { Inject, Logger, Module, OnApplicationShutdown } from '@nestjs/common';
import { ConfigModule } from '@nanite-systems/utils';
import { RabbitMqConfig } from './rabbit-mq.config';
import { EVENT_EXCHANGE, RABBIT_MQ } from './constants';
import { AmqpConnectionManager, connect } from 'amqp-connection-manager';
import { ExchangeFactory } from './factories/exchange.factory';
import { RabbitMqIndicator } from './indicators/rabbit-mq.indicator';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [ConfigModule.forFeature([RabbitMqConfig]), TerminusModule],
  providers: [
    ExchangeFactory,
    RabbitMqIndicator,

    {
      provide: RABBIT_MQ,
      useFactory: (config: RabbitMqConfig) => connect(config.url),
      inject: [RabbitMqConfig],
    },
    {
      provide: EVENT_EXCHANGE,
      useFactory: (factory: ExchangeFactory, config: RabbitMqConfig) =>
        factory.create(config.collectorExchange, {
          type: config.collectorExchangeType,
          durable: config.collectorExchangeDurable,
          autoDelete: config.collectorExchangeAutoDelete,
        }),
      inject: [ExchangeFactory, RabbitMqConfig],
    },
  ],
  exports: [EVENT_EXCHANGE, RabbitMqIndicator],
})
export class RabbitMqModule implements OnApplicationShutdown {
  private readonly logger = new Logger('RabbitMQ');

  constructor(
    @Inject(RABBIT_MQ) private readonly rabbit: AmqpConnectionManager,
  ) {
    rabbit
      .on('connect', () => {
        this.logger.log('Connected');
      })
      .on('disconnect', () => {
        this.logger.log('Disconnected');
      })
      .on('connectFailed', () => {
        this.logger.warn('Connection failed');
      });
  }

  async onApplicationShutdown(): Promise<void> {
    await this.rabbit.close();
  }
}
