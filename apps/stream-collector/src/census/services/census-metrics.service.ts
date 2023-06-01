import { Inject, Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Gauge } from 'prom-client';
import { MANAGED_CONNECTIONS } from '../constants';
import { ManagedConnection, State } from '../utils/managed-connection';
import { from, map, mergeMap } from 'rxjs';

@Injectable()
export class CensusMetricsService {
  private readonly states = new Map<number, State>();

  constructor(
    @Inject(MANAGED_CONNECTIONS)
    private readonly connections: ManagedConnection[],
    @InjectMetric('ess_connection_start_time_seconds')
    private readonly connectionStartGauge: Gauge,
    @InjectMetric('ess_connection_heartbeat_offset_seconds')
    private readonly heartbeatOffsetGauge: Gauge,
    @InjectMetric('ess_connection_state_count')
    private readonly stateCounter: Counter,
    @InjectMetric('ess_connection_state_total')
    private readonly stateGauge: Gauge,
  ) {
    from(connections)
      .pipe(
        mergeMap((connection, i) =>
          connection.observeStateChange().pipe(
            map((state) => ({
              connection,
              state,
              prev: this.states.get(i),
              i,
            })),
          ),
        ),
      )
      .subscribe(({ connection, state, prev, i }) => {
        this.states.set(i, state);

        if (connection.connectedAt)
          this.connectionStartGauge.set(
            { connection: i },
            connection.connectedAt,
          );
        else this.connectionStartGauge.remove({ connection: i });

        if (connection.heartbeatOffset)
          this.heartbeatOffsetGauge.set(
            { connection: i },
            connection.heartbeatOffset,
          );
        else this.heartbeatOffsetGauge.remove({ connection: i });

        this.stateCounter.inc({
          connection: i,
          type: State[state],
        });
        this.stateGauge.inc({ type: State[state] });
        if (prev != undefined) this.stateGauge.dec({ type: State[prev] });
      });
  }
}
