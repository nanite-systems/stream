import { Module } from '@nestjs/common';
import {
  makeCounterProvider,
  PrometheusModule,
} from '@willsoto/nestjs-prometheus';
import { MultiplexerModule } from '../multiplexer/multiplexer.module';
import { CensusModule } from '../census/census.module';
import { MetricService } from './services/metric.service';

@Module({
  imports: [PrometheusModule.register(), CensusModule, MultiplexerModule],
  providers: [
    MetricService,

    makeCounterProvider({
      name: 'ess_messages',
      help: 'Messages received from ess',
      labelNames: ['connection', 'event', 'world'],
    }),
    makeCounterProvider({
      name: 'ess_duplicates',
      help: 'Duplicate messages received from ess',
      labelNames: ['connection', 'event', 'world'],
    }),
  ],
})
export class MetricModule {}
