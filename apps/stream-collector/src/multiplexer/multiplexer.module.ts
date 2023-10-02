import { Module } from '@nestjs/common';
import { MultiplexerService } from './services/multiplexer.service';
import { EventEntityFactory } from './factories/event-entity.factory';
import { CensusModule } from '../census/census.module';
import {
  makeCounterProvider,
  makeSummaryProvider,
} from '@willsoto/nestjs-prometheus';
import { StreamMetricService } from './services/stream-metric.service';
import {
  essDuplicateCount,
  essMessageCount,
  essMessageLatencySeconds,
} from '../metrics';

@Module({
  imports: [CensusModule],
  providers: [
    EventEntityFactory,
    MultiplexerService,
    StreamMetricService,

    makeCounterProvider({
      name: essMessageCount,
      help: 'Messages received from ess',
      labelNames: ['connection', 'event', 'world'],
    }),
    makeCounterProvider({
      name: essDuplicateCount,
      help: 'Duplicate messages received from ess',
      labelNames: ['connection', 'event', 'world'],
    }),
    makeSummaryProvider({
      name: essMessageLatencySeconds,
      help: 'Latency in seconds of messages received based on timestamp in the message',
      labelNames: ['world', 'connection'],
      percentiles: [0.01, 0.1, 0.25, 0.5, 0.75, 0.9, 0.99],
      maxAgeSeconds: 300,
      ageBuckets: 5,
    }),
  ],
  exports: [MultiplexerService],
})
export class MultiplexerModule {}
