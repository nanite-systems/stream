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
import { Counter } from 'prom-client';
import { Logger } from '@nss/utils';
import { CensusMessages } from 'ps2census/stream';

export class EssAdapter implements ConnectionContract {
  private readonly readyObservable: Observable<void>;
  private readonly disconnectObservable: Observable<any>;
  private readonly heartbeatObservable: Observable<number>;
  private readonly serviceStateObservable: Observable<ServiceState>;
  private readonly eventMessageObservable: Observable<EventPayload>;

  constructor(
    readonly label: string,
    readonly stream: Stream.Client,
    subscriptionAlterCounter: Counter,
    logger: Logger,
    subscribeTo: Omit<Stream.CensusCommands.Subscribe, 'service' | 'action'>,
    subscriptionInterval: number,
  ) {
    const message = fromEvent<Stream.CensusMessageWithoutEcho>(
      stream,
      'message',
    ).pipe(share());

    this.readyObservable = fromEvent(stream, 'ready').pipe<any>(share());
    this.disconnectObservable = fromEvent<[number, string]>(
      stream,
      'close',
    ).pipe(
      map(([code, reason]) => ({ code, reason })),
      share(),
    );

    this.heartbeatObservable = message.pipe(
      filter(
        (msg): msg is Stream.CensusMessages.Heartbeat =>
          'type' in msg && msg.type == 'heartbeat',
      ),
      map((msg) => parseInt(msg.timestamp, 10)),
      share(),
    );

    this.serviceStateObservable = message.pipe(
      filter(
        (msg): msg is CensusMessages.ServiceStateChanged =>
          'type' in msg && msg.type == 'serviceStateChanged',
      ),
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
      filter(
        (msg): msg is { service: any; type: any; payload: Stream.PS2Event } =>
          'payload' in msg && 'event_name' in msg.payload,
      ),
      map((msg) => msg.payload),
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
          });
        } catch {}
      });

    message
      .pipe(
        filter(
          (msg): msg is Stream.CensusMessages.Subscription =>
            'subscription' in msg,
        ),
      )
      .subscribe(({ subscription }) => {
        const charactersValid =
          'characterCount' in subscription
            ? subscription.characterCount == subscribeTo.characters.length
            : subscription.characters.includes('all') ==
              subscribeTo.characters.includes('all');

        const worldsValid = subscribeTo.worlds.every((world) =>
          subscription.worlds.includes(world),
        );

        const eventsValid = subscribeTo.eventNames.every((event) =>
          subscription.eventNames.includes(event),
        );

        const logicalAndValid =
          subscription.logicalAndCharactersWithWorlds ==
          subscribeTo.logicalAndCharactersWithWorlds;

        if (charactersValid && worldsValid && eventsValid && logicalAndValid)
          return;

        logger.log('Subscription altered', subscription, this.label);

        subscriptionAlterCounter.inc({});

        try {
          stream.send({
            service: 'event',
            action: 'subscribe',
            ...subscribeTo,
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
