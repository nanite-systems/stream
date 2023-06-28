import { Module } from '@nestjs/common';
import { EventStreamFactory } from './factories/event-stream.factory';
import { ServiceStateModule } from '../service-state/service-state.module';
import { DistributorService } from './services/distributor.service';
import { StreamChannelFactory } from './factories/stream-channel.factory';
import { STREAM_CHANNEL } from './constants';
import { makeHistogramProvider } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [ServiceStateModule],
  providers: [
    EventStreamFactory,
    StreamChannelFactory,
    DistributorService,

    {
      provide: STREAM_CHANNEL,
      useFactory: (factory: StreamChannelFactory) => factory.create(),
      inject: [StreamChannelFactory],
    },

    makeHistogramProvider({
      name: 'nss_message_latency_milliseconds',
      help: 'Message latency in milliseconds received from the collector',
      buckets: [0, 1, 2, 5, 10, 30, 100, 300],
    }),
  ],
  exports: [EventStreamFactory],
})
export class IngressModule {}
