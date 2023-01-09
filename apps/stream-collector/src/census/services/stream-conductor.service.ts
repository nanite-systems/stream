import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { EssConfig } from '../config/ess.config';
import { StreamManagerService } from './stream-manager.service';
import { MANAGED_STREAMS } from '../constants';

interface Cycle {
  cycle: number;
  best: number;
}

interface LongCycle {
  heartbeat: number;

  cancel(): void;
}

class CycleTracker {
  private readonly cache = new Map<StreamManagerService, Cycle>();

  hit(connection: StreamManagerService, diff: number): Cycle {
    let { cycle, best } = this.cache.get(connection) ?? {};

    best = Math.max(best, diff);

    this.cache.set(connection, { cycle: cycle + 1, best });

    return { cycle, best };
  }

  clear(connection: StreamManagerService): void {
    this.cache.delete(connection);
  }
}

@Injectable()
export class StreamConductorService
  implements OnModuleInit, OnApplicationBootstrap, OnApplicationShutdown
{
  private readonly logger = new Logger(StreamConductorService.name);

  private readonly acceptedHeartbeats = new Map<StreamManagerService, number>();
  private readonly cycleCache = new CycleTracker();
  private readonly longCycles = new Map<StreamManagerService, LongCycle>();

  private heartbeatDelta: (a: number, b: number) => number;

  constructor(
    @Inject(MANAGED_STREAMS)
    private readonly connections: StreamManagerService[],
    private readonly config: EssConfig,
  ) {
    const heartbeat = this.config.heartbeatInterval;
    const half = Math.floor(heartbeat / 2);

    this.heartbeatDelta = (a, b) => {
      if (a < b) [a, b] = [b, a];
      return half - Math.abs(half - ((a - b) % heartbeat));
    };
  }

  async onModuleInit() {
    for (const connection of this.connections)
      this.prepareConnection(connection);
  }

  async onApplicationBootstrap() {
    await Promise.all(this.connections.map((c) => c.start()));
  }

  onApplicationShutdown(): void {
    for (const { cancel } of this.longCycles.values()) cancel();
    for (const connection of this.connections) connection.destroy();
  }

  private prepareConnection(connection: StreamManagerService): void {
    const heartbeatListener = (message) => {
      if (
        'service' in message &&
        message.service === 'event' &&
        message.type === 'heartbeat'
      ) {
        connection.stream.off('message', heartbeatListener);
        this.registerHeartbeat(connection);
      }
    };

    connection.stream
      .on('ready', () => {
        connection.stream.on('message', heartbeatListener);
      })
      .on('close', () => {
        const oldHeartbeat = this.acceptedHeartbeats.get(connection);
        const longCycle = this.longCycles.get(connection);

        if (longCycle) {
          longCycle.cancel();
        } else if (oldHeartbeat) {
          for (const { cancel, heartbeat } of this.longCycles.values())
            if (
              this.heartbeatDelta(oldHeartbeat, heartbeat) <=
              this.config.heartbeatDiffThreshold
            ) {
              cancel();
              break;
            }
        }

        connection.stream.off('message', heartbeatListener);
        this.acceptedHeartbeats.delete(connection);
      });
  }

  private registerHeartbeat(connection: StreamManagerService): void {
    const heartbeat = Date.now();

    const minDelta = this.minHeartbeatDelta(heartbeat);
    const { cycle, best } = this.cycleCache.hit(connection, minDelta);
    const tooManyGodDamnCycles = cycle >= this.config.acceptBest;
    const threshold = tooManyGodDamnCycles
      ? this.config.bestMultiplier * best
      : this.config.heartbeatDiffThreshold;

    if (minDelta <= threshold) {
      connection.cycle();
    } else {
      this.logger.log(
        `Accepted connection: ${JSON.stringify({
          minDelta,
          tooManyGodDamnCycles,
        })}`,
      );

      this.acceptedHeartbeats.set(connection, heartbeat);
      this.cycleCache.clear(connection);

      if (tooManyGodDamnCycles) this.setLongCycle(connection, heartbeat);
    }
  }

  private minHeartbeatDelta(heartbeat: number): number {
    return Array.from(this.acceptedHeartbeats.values()).reduce(
      (r, c) => Math.min(r, this.heartbeatDelta(heartbeat, c)),
      Infinity,
    );
  }

  private setLongCycle(
    connection: StreamManagerService,
    heartbeat: number,
  ): void {
    const timeout = setTimeout(() => {
      connection.cycle();
    }, this.config.longCycle);

    const cancel = () => {
      this.longCycles.delete(connection);
      clearTimeout(timeout);
    };

    this.longCycles.set(connection, {
      heartbeat,
      cancel,
    });
  }

  getStatus() {
    return {
      connections: this.connections.length,
      cycling: this.connections.length - this.acceptedHeartbeats.size,
      longCycle: this.longCycles.size,
      heartbeatsOffsets: Array.from(this.acceptedHeartbeats.values()).map(
        (h) => h % 30000,
      ),
    };
  }
}
