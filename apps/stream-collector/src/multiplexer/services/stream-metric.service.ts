import { Inject, Injectable } from '@nestjs/common';
import { CONNECTIONS } from '../../census/constants';
import { ConnectionContract } from '../../census/concerns/connection.contract';
import { MultiplexerService } from '../../multiplexer/services/multiplexer.service';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Summary } from 'prom-client';
import {
  essDuplicateCount,
  essMessageCount,
  essMessageLatencySeconds,
} from '../../metrics';

@Injectable()
export class StreamMetricService {
  constructor(
    @Inject(CONNECTIONS) private readonly connections: ConnectionContract[],
    private readonly multiplexer: MultiplexerService,
    @InjectMetric(essMessageCount)
    private readonly messageCounter: Counter,
    @InjectMetric(essDuplicateCount)
    private readonly duplicateCounter: Counter,
    @InjectMetric(essMessageLatencySeconds)
    private readonly latencyHistogram: Summary,
  ) {
    this.connections.forEach((connection, id) => {
      connection.observeEventMessage().subscribe((event) => {
        this.latencyHistogram.observe(
          {
            world: event.world_id,
            connection: id,
          },
          Math.floor(new Date().getTime() / 1000) -
            parseInt(event.timestamp, 10),
        );

        this.messageCounter.inc({
          connection: id,
          event: event.event_name,
          world: event.world_id,
        });
      });
    });

    this.multiplexer.observeStream().subscribe((event) =>
      this.messageCounter.inc({
        connection: 'multiplexed',
        event: event.payload.event_name,
        world: event.payload.world_id,
      }),
    );

    this.multiplexer.observeDuplicates().subscribe((event) =>
      this.duplicateCounter.inc({
        connection: this.connections.indexOf(event.connection) + 1,
        event: event.payload.event_name,
        world: event.payload.world_id,
      }),
    );
  }
}
