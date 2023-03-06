import { Inject, Module } from '@nestjs/common';
import { MultiplexerService } from '../multiplexer/services/multiplexer.service';
import { CONNECTIONS } from '../census/constants';
import { ConnectionContract } from '../census/concerns/connection.contract';
import {
  InjectMetric,
  makeCounterProvider,
  PrometheusModule,
} from '@willsoto/nestjs-prometheus';
import { Counter, Gauge } from 'prom-client';
import { MultiplexerModule } from '../multiplexer/multiplexer.module';
import { CensusModule } from '../census/census.module';

@Module({
  imports: [PrometheusModule.register(), CensusModule, MultiplexerModule],
  providers: [
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
export class MetricModule {
  constructor(
    @Inject(CONNECTIONS) private readonly connections: ConnectionContract[],
    private readonly multiplexer: MultiplexerService,
    @InjectMetric('ess_connection')
    private readonly connectionGauge: Gauge,
    @InjectMetric('ess_messages')
    private readonly messageCounter: Counter,
    @InjectMetric('ess_duplicates')
    private readonly duplicateCounter: Counter,
  ) {
    this.connections.forEach((connection, id) =>
      connection.observeEventMessage().subscribe((event) =>
        this.messageCounter.inc({
          connection: id,
          event: event.event_name,
          world: event.world_id,
        }),
      ),
    );

    this.multiplexer.observeStream().subscribe((event) =>
      this.messageCounter.inc({
        connection: 'multiplexed',
        event: event.payload.event_name,
        world: event.payload.world_id,
      }),
    );

    this.multiplexer.observeDuplicates().subscribe((event) =>
      this.duplicateCounter.inc({
        connection: this.connections.indexOf(event.connection),
        event: event.payload.event_name,
        world: event.payload.world_id,
      }),
    );
  }
}
