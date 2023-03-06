import { ConnectionContract } from '../concerns/connection.contract';
import {
  defer,
  exhaustMap,
  filter,
  first,
  merge,
  Observable,
  of,
  retry,
  Subscription,
  switchMap,
  takeUntil,
  tap,
  timer,
} from 'rxjs';
import { HeartbeatOffsetAccessorContract } from '../concerns/heartbeat-offset-accessor.contract';
import { StreamConductorService } from '../services/stream-conductor.service';
import { DelayPolicyContract } from '../concerns/delay-policy.contract';
import { Logger } from '@nestjs/common';

export interface ManagedConnectionOptions {
  subscribeInterval: number;
  characters: string[];
  eventNames: string[];
  worlds: string[];
  logicalAndCharactersWithWorlds: boolean;
}

export class ManagedConnection {
  private accepted = false;

  private connectedAt?: number;

  private heartbeatOffset?: number;

  private wasForcedDisconnect = false;

  private cycleCounter = 0;

  private connectionSubscription?: Subscription;

  constructor(
    private readonly logger: Logger,
    private readonly connection: ConnectionContract,
    private readonly offsetAccessor: HeartbeatOffsetAccessorContract,
    private readonly delayPolicy: DelayPolicyContract,
    private readonly conductor: StreamConductorService,
    private readonly options: ManagedConnectionOptions,
  ) {
    /** Cycle connection logic */
    this.observeInitHeartbeat().subscribe(() => {
      this.heartbeatOffset = this.offsetAccessor.getOffset();

      if (this.conductor.claim(this, this.heartbeatOffset)) {
        this.logger.log(
          `Connection accepted: ${JSON.stringify({
            heartbeatOffset: this.heartbeatOffset,
          })}`,
        );
        this.accepted = true;
        this.cycleCounter = 0;
      } else {
        this.logger.verbose(
          `Cycling connection: ${JSON.stringify({
            cycle: ++this.cycleCounter,
            heartbeatOffset: this.heartbeatOffset,
          })}`,
        );

        this.wasForcedDisconnect = true;
        this.connection.disconnect();
      }
    });

    /** Subscribe logic */
    this.connection
      .observeConnect()
      .pipe(
        switchMap(() =>
          timer(0, this.options.subscribeInterval).pipe(
            takeUntil(this.connection.observeDisconnect()),
          ),
        ),
      )
      .subscribe(() =>
        this.connection.subscribe({
          characters: this.options.characters,
          eventNames: this.options.eventNames,
          worlds: this.options.worlds,
          logicalAndCharactersWithWorlds:
            this.options.logicalAndCharactersWithWorlds,
        }),
      );

    /** Disconnect log */
    this.connection
      .observeDisconnect()
      .pipe(filter(() => this.accepted))
      .subscribe((details) =>
        this.logger.log(`Disconnected: ${JSON.stringify(details)}`),
      );
  }

  start(): void {
    if (this.connectionSubscription && !this.connectionSubscription.closed)
      return;

    this.wasForcedDisconnect = false;
    this.cycleCounter = 0;

    const connectOn = merge(
      of(this.connection),
      this.connection.observeDisconnect(),
    );

    this.connectionSubscription = connectOn
      .pipe(
        tap(() => {
          this.accepted = false;
          delete this.connectedAt;
          this.conductor.release(this);
        }),
        tap(() => this.logger.verbose('Connecting')),
        exhaustMap(() =>
          defer(() => this.connection.connect()).pipe(
            tap({
              error: (err) => this.logger.debug(`Connection failed: ${err}`),
            }),
            retry({
              delay: (err, retryCount) =>
                timer(
                  this.delayPolicy.next(
                    this.wasForcedDisconnect,
                    retryCount,
                    this.cycleCounter,
                  ),
                ),
            }),
          ),
        ),
      )
      .subscribe(() => {
        this.logger.debug('Connected');

        this.connectedAt = new Date().getTime();
        this.wasForcedDisconnect = false;
      });
  }

  stop(): void {
    this.connectionSubscription?.unsubscribe();
    this.connection.disconnect();
  }

  private observeInitHeartbeat(): Observable<void> {
    return this.connection
      .observeConnect()
      .pipe(switchMap(() => this.connection.observeHeartbeat().pipe(first())));
  }

  status() {
    return {
      accepted: this.accepted,
      cycle: this.cycleCounter,
      heartbeatOffset: this.heartbeatOffset,
      connectedAt: this.connectedAt,
    };
  }
}