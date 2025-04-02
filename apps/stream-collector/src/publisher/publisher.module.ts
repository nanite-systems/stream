import { Module } from '@nestjs/common';
import {
  PUBLISHER_OPTIONS,
  PublisherService,
  PublisherServiceOptions,
} from './services/publisher.service';
import { RabbitMqModule } from '@nss/rabbitmq';
import { DUPLICATE_EXCHANGE, STREAM_EXCHANGE } from './constant';
import { ExchangeFactory } from './factories/exchange.factory';
import { ConfigService } from '@nestjs/config';
import { MultiplexerModule } from '../multiplexer/multiplexer.module';
import { ServiceTrackerModule } from '../service-tracker/service-tracker.module';

@Module({
  imports: [
    RabbitMqModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        urls: config.get('rabbitmq.urls'),
      }),
      inject: [ConfigService],
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
      useFactory: (config: ConfigService) =>
        ({
          exchangeName: config.get('rabbitmq.streamExchangeName'),
          duplicateExchangeName: config.get('rabbitmq.duplicateExchangeName'),
          appId: config.get('app.id'),
        }) satisfies PublisherServiceOptions,
      inject: [ConfigService],
    },

    /** Exchanges */
    {
      provide: STREAM_EXCHANGE,
      useFactory: (config: ConfigService, factory: ExchangeFactory) =>
        factory.create(config.get('rabbitmq.streamExchangeName'), 'fanout', {
          durable: true,
        }),
      inject: [ConfigService, ExchangeFactory],
    },
    {
      provide: DUPLICATE_EXCHANGE,
      useFactory: (config: ConfigService, factory: ExchangeFactory) =>
        factory.create(config.get('rabbitmq.duplicateExchangeName'), 'fanout', {
          durable: true,
        }),
      inject: [ConfigService, ExchangeFactory],
    },
  ],
  exports: [PublisherService],
})
export class PublisherModule {}
