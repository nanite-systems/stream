import { ConnectionContract } from '../concerns/connection.contract';
import { filter, from, fromEvent, map, Observable, share } from 'rxjs';
import { Stream } from 'ps2census';
import { EventPayload } from '../concerns/event-payload.type';

export class EssAdapter implements ConnectionContract {
  private readonly readyObservable: Observable<void>;
  private readonly disconnectObservable: Observable<any>;
  private readonly heartbeatObservable: Observable<void>;
  private readonly eventMessageObservable: Observable<EventPayload>;

  constructor(readonly stream: Stream.Client) {
    const message = fromEvent(stream, 'message').pipe(share());

    this.readyObservable = fromEvent(stream, 'ready').pipe(share()) as any;
    this.disconnectObservable = fromEvent(stream, 'close').pipe(
      map(([code, reason]) => ({ code, reason })),
      share(),
    );
    this.heartbeatObservable = message.pipe(
      filter<Stream.CensusMessage>(
        (msg) => msg.service == 'event' && msg.type == 'heartbeat',
      ),
      share(),
    );
    this.eventMessageObservable = message.pipe(
      filter<Stream.CensusMessage>(
        (msg) =>
          msg.service == 'event' &&
          msg.type == 'serviceMessage' &&
          'payload' in msg,
      ),
      map((msg) => msg.payload),
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

  observeEventMessage(): Observable<EventPayload> {
    return this.eventMessageObservable;
  }
}
