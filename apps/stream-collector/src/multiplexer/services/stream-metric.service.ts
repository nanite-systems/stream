import { Inject, Injectable } from '@nestjs/common';
import { DETAILED_CONNECTIONS } from '../../census/constants';
import { MultiplexerService } from '../../multiplexer/services/multiplexer.service';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Summary } from 'prom-client';
import {
  essDuplicateCount,
  essMessageCount,
  essMessageLatencySeconds,
} from '../../metrics';
import { DetailedConnectionContract } from '../../census/concerns/detailed-connection.contract';
import { from } from 'rxjs';

@Injectable()
export class StreamMetricService {
  constructor(
    @Inject(DETAILED_CONNECTIONS)
    private readonly connections: DetailedConnectionContract[],
    private readonly multiplexer: MultiplexerService,
    @InjectMetric(essMessageCount)
    private readonly messageCounter: Counter,
    @InjectMetric(essDuplicateCount)
    private readonly duplicateCounter: Counter,
    @InjectMetric(essMessageLatencySeconds)
    private readonly latencyHistogram: Summary,
  ) {
    this.messageMetrics();
    this.multiplexedMessageMetrics();
    this.duplicateMetrics();
  }

  private messageMetrics(): void {
    from(this.connections).subscribe(({ details: { id }, connection }) => {
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
  }

  private multiplexedMessageMetrics(): void {
    this.multiplexer.observeStream().subscribe((event) =>
      this.messageCounter.inc({
        connection: 'multiplexed',
        event: event.payload.event_name,
        world: event.payload.world_id,
      }),
    );
  }

  private duplicateMetrics(): void {
    this.multiplexer.observeDuplicates().subscribe((event) =>
      this.duplicateCounter.inc({
        connection: event.connectionDetails.id,
        event: event.payload.event_name,
        world: event.payload.world_id,
      }),
    );
  }
}
