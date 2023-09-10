import { Inject, Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Gauge } from 'prom-client';
import { MANAGED_CONNECTIONS } from '../constants';
import { ManagedConnection, State } from '../utils/managed-connection';
import { from, map, mergeMap, scan } from 'rxjs';
import {
  essConnectionClockOffsetSeconds,
  essConnectionHeartbeatOffsetSeconds,
  essConnectionStartTimeSeconds,
  essConnectionStateCount,
  essConnectionStateTotal,
} from '../../metrics';

interface StateMemo {
  connection: ManagedConnection;
  prev?: State;
  state: State;
  id: number;
}

@Injectable()
export class CensusMetricsService {
  constructor(
    @Inject(MANAGED_CONNECTIONS)
    private readonly connections: ManagedConnection[],
    @InjectMetric(essConnectionStartTimeSeconds)
    private readonly connectionStartGauge: Gauge,
    @InjectMetric(essConnectionHeartbeatOffsetSeconds)
    private readonly heartbeatOffsetGauge: Gauge,
    @InjectMetric(essConnectionStateCount)
    private readonly stateCounter: Counter,
    @InjectMetric(essConnectionStateTotal)
    private readonly stateGauge: Gauge,
    @InjectMetric(essConnectionClockOffsetSeconds)
    private readonly clockOffset: Gauge,
  ) {
    this.watchState();
    this.watchTimeDiff();
  }

  private watchState(): void {
    from(this.connections)
      .pipe(
        mergeMap((connection, id) =>
          connection.observeStateChange().pipe(
            scan(
              (prev: StateMemo, state) => ({
                ...prev,
                prev: prev.state,
                state,
              }),
              {
                connection,
                state: undefined,
                id,
              },
            ),
          ),
        ),
      )
      .subscribe(({ connection, state, prev, id }) => {
        if (connection.connectedAt)
          this.connectionStartGauge.set(
            { connection: id },
            connection.connectedAt,
          );
        else this.connectionStartGauge.remove({ connection: id });

        if (connection.heartbeatOffset)
          this.heartbeatOffsetGauge.set(
            { connection: id },
            connection.heartbeatOffset,
          );
        else this.heartbeatOffsetGauge.remove({ connection: id });

        this.stateCounter.inc({
          connection: id,
          type: State[state],
        });
        this.stateGauge.inc({ type: State[state] });
        if (prev != undefined) this.stateGauge.dec({ type: State[prev] });
      });
  }

  private watchTimeDiff(): void {
    from(this.connections)
      .pipe(
        mergeMap(({ connection }, id) =>
          connection.observeHeartbeat().pipe(
            map((heartbeat) => ({
              id,
              offset: heartbeat - Math.floor(new Date().getTime() / 1000),
            })),
          ),
        ),
      )
      .subscribe(({ id, offset }) => {
        this.clockOffset.set({ connection: id }, offset);
      });
  }
}
