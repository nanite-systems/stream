import { Module } from '@nestjs/common';
import { EventStreamFactory } from './factories/event-stream.factory';
import { ServiceStateModule } from '../service-state/service-state.module';
import { RabbitMqModule } from '@nss/rabbitmq';
import { DistributorService } from './services/distributor.service';
import { StreamChannelFactory } from './factories/stream-channel.factory';
import { ConfigModule } from '@nss/utils';
import { IngressConfig } from './ingress.config';
import { STREAM_CHANNEL } from './constants';

@Module({
  imports: [
    ConfigModule.forFeature([IngressConfig]),
    RabbitMqModule,
    ServiceStateModule,
  ],
  providers: [
    EventStreamFactory,
    StreamChannelFactory,
    DistributorService,
    {
      provide: STREAM_CHANNEL,
      useFactory: (factory: StreamChannelFactory) => factory.create(),
      inject: [StreamChannelFactory],
    },
  ],
  exports: [EventStreamFactory],
})
export class IngressModule {}
