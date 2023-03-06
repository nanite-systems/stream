import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';
import { Inject } from '@nestjs/common';
import { CONNECTIONS } from '../../census/constants';
import { ConnectionContract } from '../../census/concerns/connection.contract';
import { MultiplexerService } from './multiplexer.service';

export class MetricService {
  constructor(
    @Inject(CONNECTIONS) private readonly connections: ConnectionContract[],
    private readonly multiplexer: MultiplexerService,
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
