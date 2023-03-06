import { Module } from '@nestjs/common';
import { MultiplexerService } from './services/multiplexer.service';
import { EventEntityFactory } from './factories/event-entity.factory';
import { CensusModule } from '../census/census.module';
import { makeCounterProvider } from '@willsoto/nestjs-prometheus';
import { MetricService } from './services/metric.service';

@Module({
  imports: [CensusModule],
  providers: [
    EventEntityFactory,
    MultiplexerService,
    MetricService,

    makeCounterProvider({
      name: 'ess_messages',
      help: 'Messages received from ess',
      labelNames: ['connection', 'event', 'world'],
    }),
    makeCounterProvider({
      name: 'ess_duplicates',
      help: 'Messages received from ess',
      labelNames: ['connection', 'event', 'world'],
    }),
  ],
  exports: [MultiplexerService],
})
export class MultiplexerModule {}
