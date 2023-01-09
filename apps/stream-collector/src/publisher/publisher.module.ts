import { Module } from '@nestjs/common';
import { PublisherService } from './services/publisher.service';
import { ConfigModule } from '@nss/utils';
import { PublisherConfig } from './publisher.config';
import { RabbitMqModule } from '@nss/rabbitmq';
import { COLLECTOR_CHANNEL } from './constant';
import { CollectorChannelFactory } from './factories/collector-channel.factory';

@Module({
  imports: [ConfigModule.forFeature([PublisherConfig]), RabbitMqModule],
  providers: [
    CollectorChannelFactory,
    PublisherService,

    {
      provide: COLLECTOR_CHANNEL,
      useFactory: (factory: CollectorChannelFactory) => factory.create(),
      inject: [CollectorChannelFactory],
    },
  ],
  exports: [PublisherService],
})
export class PublisherModule {}
