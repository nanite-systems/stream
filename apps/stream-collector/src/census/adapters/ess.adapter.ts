import { ConnectionContract } from '../concerns/connection.contract';
import { filter, from, fromEvent, map, Observable, share } from 'rxjs';
import { Stream } from 'ps2census';
import { EventPayload, ServiceState } from '@nss/ess-concerns';

export class EssAdapter implements ConnectionContract {
  private readonly readyObservable: Observable<void>;
  private readonly disconnectObservable: Observable<any>;
  private readonly heartbeatObservable: Observable<void>;
  private readonly serviceStateObservable: Observable<ServiceState>;
  private readonly eventMessageObservable: Observable<EventPayload>;

  constructor(readonly stream: Stream.Client) {
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
      map(() => undefined),
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
  }

  connect(): Observable<void> {
    return from(this.stream.connect());
  }

  disconnect(): void {
    this.stream.destroy();
  }

  subscribe(subscription: {
    characters?: string[];
    eventNames?: string[];
    worlds?: string[];
    logicalAndCharactersWithWorlds?: boolean;
  }) {
    try {
      this.stream.send({
        service: 'event',
        action: 'subscribe',
        characters: subscription.characters,
        eventNames: subscription.eventNames as any,
        worlds: subscription.worlds,
        logicalAndCharactersWithWorlds:
          subscription.logicalAndCharactersWithWorlds,
      });
    } catch {}
  }

  observeConnect(): Observable<void> {
    return this.readyObservable;
  }

  observeDisconnect(): Observable<any> {
    return this.disconnectObservable;
  }

  observeHeartbeat(): Observable<void> {
    return this.heartbeatObservable;
  }

  observeServiceState(): Observable<ServiceState> {
    return this.serviceStateObservable;
  }

  observeEventMessage(): Observable<EventPayload> {
    return this.eventMessageObservable;
  }
}
