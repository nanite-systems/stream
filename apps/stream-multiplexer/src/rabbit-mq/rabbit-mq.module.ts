import { Inject, Logger, Module, OnApplicationShutdown } from '@nestjs/common';
import { ConfigModule } from '@census-reworked/nestjs-utils';
import { RabbitMqConfig } from './rabbit-mq.config';
import { EVENT_QUEUE, PUBLISH_EXCHANGE, RABBIT_MQ } from './constants';
import { AmqpConnectionManager, connect } from 'amqp-connection-manager';
import { EventQueueFactory } from './factories/event-queue.factory';
import { PublishExchangeFactory } from './factories/publish-exchange.factory';
import { RabbitMqIndicator } from './indicators/rabbit-mq.indicator';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [ConfigModule.forFeature([RabbitMqConfig]), TerminusModule],
  providers: [
    EventQueueFactory,
    PublishExchangeFactory,
    RabbitMqIndicator,

    {
      provide: RABBIT_MQ,
      useFactory: (config: RabbitMqConfig) => connect([config.url]),
      inject: [RabbitMqConfig],
    },
    {
      provide: EVENT_QUEUE,
      useFactory: (factory: EventQueueFactory, config: RabbitMqConfig) =>
        factory.create(config.collectorExchange),
      inject: [EventQueueFactory, RabbitMqConfig],
    },
    {
      provide: PUBLISH_EXCHANGE,
      useFactory: (factory: PublishExchangeFactory, config: RabbitMqConfig) =>
        factory.create(config.streamExchange),
      inject: [PublishExchangeFactory, RabbitMqConfig],
    },
  ],
  exports: [EVENT_QUEUE, PUBLISH_EXCHANGE, RabbitMqIndicator],
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
