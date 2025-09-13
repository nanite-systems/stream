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
  Subject,
  Subscription,
  switchMap,
  takeUntil,
  tap,
  timer,
} from 'rxjs';
import { StreamConductorService } from '../services/stream-conductor.service';
import { DelayPolicyContract } from '../concerns/delay-policy.contract';
import { Logger } from '@nss/utils';
import { ConnectionDetails } from './connection-details';

export enum State {
  DISCONNECTED,
  CONNECTING,
  FAILED,
  CONNECTED,
  CYCLING,
  ACCEPTED,
}

export class ManagedConnection {
  accepted = false;

  connectedAt?: number;

  heartbeatOffset?: number;

  private wasForcedDisconnect = false;

  cycleCounter = 0;

  private connectionSubscription?: Subscription;

  private readonly stateChange = new Subject<State>();

  constructor(
    readonly details: ConnectionDetails,
    private readonly logger: Logger,
    readonly connection: ConnectionContract,
    private readonly delayPolicy: DelayPolicyContract,
    private readonly conductor: StreamConductorService,
    heartbeatInterval: number,
  ) {
    /** Cycle connection logic */
    this.observeInitHeartbeat().subscribe((heartbeat) => {
      this.heartbeatOffset = heartbeat % heartbeatInterval;

      if (this.conductor.claim(this.details.label, this.heartbeatOffset)) {
        this.logger.log(
          `Connection accepted`,
          {
            heartbeatOffset: this.heartbeatOffset,
          },
          this.details.label,
        );
        this.accepted = true;
        this.cycleCounter = 0;

        this.stateChange.next(State.ACCEPTED);
      } else {
        this.logger.verbose(
          `Cycling connection`,
          {
            cycle: ++this.cycleCounter,
            heartbeatOffset: this.heartbeatOffset,
          },
          this.details.label,
        );

        timer(this.delayPolicy.next(true, 0, this.cycleCounter))
          .pipe(takeUntil(this.connection.observeDisconnect()))
          .subscribe(() => {
            this.wasForcedDisconnect = true;
            this.connection.disconnect();
          });

        this.stateChange.next(State.CYCLING);
      }
    });

    /** Disconnect log */
    this.connection
      .observeDisconnect()
      .pipe(filter(() => this.accepted))
      .subscribe((details) => {
        this.logger.log(`Disconnected`, details, this.details.label);

        this.stateChange.next(State.DISCONNECTED);
      });
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
          delete this.heartbeatOffset;

          this.conductor.release(this.details.label);

          this.logger.verbose('Connecting', this.details.label);
          this.stateChange.next(State.CONNECTING);
        }),
        exhaustMap(() =>
          defer(() => this.connection.connect()).pipe(
            tap({
              error: (err) => {
                this.logger.debug(
                  `Connection failed: ${err}`,
                  this.details.label,
                );

                this.stateChange.next(State.FAILED);
              },
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
        this.logger.debug('Connected', this.details.label);

        this.connectedAt = new Date().getTime();
        this.wasForcedDisconnect = false;

        this.stateChange.next(State.CONNECTED);
      });
  }

  stop(): void {
    this.connectionSubscription?.unsubscribe();
    this.connection.disconnect();
  }

  private observeInitHeartbeat(): Observable<number> {
    return this.connection
      .observeConnect()
      .pipe(switchMap(() => this.connection.observeHeartbeat().pipe(first())));
  }

  observeStateChange(): Observable<State> {
    return this.stateChange;
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
