import { Module } from '@nestjs/common';
import { MultiplexerService } from './services/multiplexer.service';
import { EventEntityFactory } from './factories/event-entity.factory';
import { CensusModule } from '../census/census.module';
import { makeCounterProvider } from '@willsoto/nestjs-prometheus';
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
  ],
  exports: [MultiplexerService],
})
export class MultiplexerModule {}
