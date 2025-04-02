import { Module } from '@nestjs/common';
import {
  PUBLISHER_OPTIONS,
  PublisherService,
  PublisherServiceOptions,
} from './services/publisher.service';
import { RabbitMqModule } from '@nss/rabbitmq';
import { DUPLICATE_EXCHANGE, STREAM_EXCHANGE } from './constant';
import { ExchangeFactory } from './factories/exchange.factory';
import { MultiplexerModule } from '../multiplexer/multiplexer.module';
import { ServiceTrackerModule } from '../service-tracker/service-tracker.module';
import { config } from '../config';

@Module({
  imports: [
    RabbitMqModule.forRootAsync({
      useFactory: () => ({
        urls: config.rabbitmq.urls,
      }),
    }),
    MultiplexerModule,
    ServiceTrackerModule,
  ],
  providers: [
    ExchangeFactory,
    PublisherService,

    /** Options */
    {
      provide: PUBLISHER_OPTIONS,
      useFactory: () =>
        ({
          exchangeName: config.rabbitmq.streamExchangeName,
          duplicateExchangeName: config.rabbitmq.duplicateExchangeName,
          appId: config.app.id,
        }) satisfies PublisherServiceOptions,
    },

    /** Exchanges */
    {
      provide: STREAM_EXCHANGE,
      useFactory: (factory: ExchangeFactory) =>
        factory.create(config.rabbitmq.streamExchangeName, 'fanout', {
          durable: true,
        }),
      inject: [ExchangeFactory],
    },
    {
      provide: DUPLICATE_EXCHANGE,
      useFactory: (factory: ExchangeFactory) =>
        factory.create(config.rabbitmq.duplicateExchangeName, 'fanout', {
          durable: true,
        }),
      inject: [ExchangeFactory],
    },
  ],
  exports: [PublisherService],
})
export class PublisherModule {}
