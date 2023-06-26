import { Module } from '@nestjs/common';
import { MultiplexerService } from './services/multiplexer.service';
import { EventEntityFactory } from './factories/event-entity.factory';
import { CensusModule } from '../census/census.module';
import {
  makeCounterProvider,
  makeHistogramProvider,
} from '@willsoto/nestjs-prometheus';
import { StreamMetricService } from './services/stream-metric.service';

@Module({
  imports: [CensusModule],
  providers: [
    EventEntityFactory,
    MultiplexerService,
    StreamMetricService,

    makeCounterProvider({
      name: 'ess_message_count',
      help: 'Messages received from ess',
      labelNames: ['connection', 'event', 'world'],
    }),
    makeCounterProvider({
      name: 'ess_duplicate_count',
      help: 'Duplicate messages received from ess',
      labelNames: ['connection', 'event', 'world'],
    }),
    makeHistogramProvider({
      name: 'ess_message_latency_seconds',
      help: 'Latency in seconds of messages received based on timestamp in the message',
      labelNames: ['world', 'connection'],
      buckets: [0, 1, 2, 5, 10, 30, 60],
    }),
  ],
  exports: [MultiplexerService],
})
export class MultiplexerModule {}
