import { ConnectionContract } from '../concerns/connection.contract';
import {
  filter,
  from,
  fromEvent,
  map,
  Observable,
  share,
  switchMap,
  takeUntil,
  timer,
} from 'rxjs';
import { Stream } from 'ps2census';
import { EventPayload, ServiceState } from '@nss/ess-concerns';

export class EssAdapter implements ConnectionContract {
  private readonly readyObservable: Observable<void>;
  private readonly disconnectObservable: Observable<any>;
  private readonly heartbeatObservable: Observable<number>;
  private readonly serviceStateObservable: Observable<ServiceState>;
  private readonly eventMessageObservable: Observable<EventPayload>;

  constructor(
    readonly stream: Stream.Client,
    subscription: Omit<Stream.CensusCommands.Subscribe, 'service' | 'action'>,
    subscriptionInterval: number,
  ) {
    const message = fromEvent(stream, 'message').pipe(
      filter((msg: any) => msg.service == 'event'),
      share(),
    );

    this.readyObservable = fromEvent(stream, 'ready').pipe<any>(share());

    this.disconnectObservable = fromEvent(stream, 'close').pipe(
      map(([code, reason]) => ({ code, reason })),
      share(),
    );

    this.heartbeatObservable = message.pipe(
      filter((msg) => msg.type == 'heartbeat'),
      map(() => new Date().getTime()),
      share(),
    );

    this.serviceStateObservable = message.pipe(
      filter((msg) => msg.type == 'serviceStateChanged'),
      map(
        (msg): ServiceState => ({
          worldId: /\d+/.exec(msg.detail)[0],
          worldName: /(?<=_)[a-z]+/i.exec(msg.detail)[0],
          detail: msg.detail,
          online: msg.online == 'true',
        }),
      ),
      share(),
    );

    this.eventMessageObservable = message.pipe(
      filter((msg) => msg.type == 'serviceMessage'),
      map((msg): EventPayload => msg.payload),
      share(),
    );

    /** Subscription logic */
    this.readyObservable
      .pipe(
        switchMap(() =>
          timer(0, subscriptionInterval).pipe(
            takeUntil(this.disconnectObservable),
          ),
        ),
      )
      .subscribe(() => {
        try {
          stream.send({
            service: 'event',
            action: 'subscribe',
            ...subscription,
          });
        } catch {}
      });
  }

  connect(): Observable<void> {
    return from(this.stream.connect());
  }

  disconnect(): void {
    this.stream.destroy();
  }

  observeConnect(): Observable<void> {
    return this.readyObservable;
  }

  observeDisconnect(): Observable<any> {
    return this.disconnectObservable;
  }

  observeHeartbeat(): Observable<number> {
    return this.heartbeatObservable;
  }

  observeServiceState(): Observable<ServiceState> {
    return this.serviceStateObservable;
  }

  observeEventMessage(): Observable<EventPayload> {
    return this.eventMessageObservable;
  }
}
