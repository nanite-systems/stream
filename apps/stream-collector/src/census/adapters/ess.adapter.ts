import { ConnectionContract } from '../concerns/connection.contract';
import {
  catchError,
  EMPTY,
  filter,
  from,
  fromEvent,
  map,
  mergeWith,
  Observable,
  of,
  OperatorFunction,
  share,
  Subject,
  switchMap,
  takeUntil,
  tap,
  timeout,
  timer,
  zipWith,
} from 'rxjs';
import { Stream } from 'ps2census';
import { EventPayload, ServiceState } from '@nss/ess-concerns';
import { CensusMessages } from 'ps2census/stream';
import { ConnectionDetails } from '../utils/connection-details';
import { Logger } from '@nss/utils';
import { Counter, Summary } from 'prom-client';

type Subscription = Omit<Stream.CensusCommands.Subscribe, 'service' | 'action'>;

export class EssAdapter implements ConnectionContract {
  private readonly readyObservable: Observable<void>;
  private readonly disconnectObservable: Observable<any>;
  private readonly heartbeatObservable: Observable<number>;
  private readonly serviceStateObservable: Observable<ServiceState>;
  private readonly eventMessageObservable: Observable<EventPayload>;

  constructor(
    logger: Logger,
    readonly stream: Stream.Client,
    readonly details: ConnectionDetails,
    private readonly connectionReadyLatency: Summary,
    subscriptionAlterCounter: Counter,
    subscriptionLatency: Summary,
    subscriptionTimeoutCounter: Counter,
    subscribeTo: Subscription,
    subscriptionInterval: number,
    subscriptionTimeout: number,
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
    const sendSubscribe =
      (
        subscription?: Subscription,
      ): OperatorFunction<any, { recordLatency(): void }> =>
      (o) =>
        o.pipe(
          tap(() => {
            try {
              this.stream.send({
                service: 'event',
                action: 'subscribe',
                ...subscription,
              });
            } catch {}
          }),
          map(() => ({
            recordLatency: subscriptionLatency.startTimer({
              connection: details.id,
            }),
          })),
        );

    const resubscribe = new Subject<null>();

    this.readyObservable
      .pipe(
        sendSubscribe(subscribeTo),

        switchMap((v) =>
          of(v).pipe(
            mergeWith(
              timer(subscriptionInterval, subscriptionInterval).pipe(
                sendSubscribe(),
              ),
              resubscribe.pipe(sendSubscribe(subscribeTo)),
            ),

            zipWith(
              message.pipe(
                filter(
                  (msg): msg is Stream.CensusMessages.Subscription =>
                    'subscription' in msg,
                ),
              ),
            ),

            timeout(subscriptionTimeout),

            catchError(() => {
              logger.warn(
                'Too long without a subscription response',
                details.label,
              );

              subscriptionTimeoutCounter.inc({ connection: details.id });

              this.stream.destroy();

              return EMPTY;
            }),

            takeUntil(this.disconnectObservable),
          ),
        ),

        tap(([{ recordLatency }]) => recordLatency()),
        map((v) => v[1]),
        map(({ subscription }) => ({
          charactersValid:
            'characterCount' in subscription
              ? subscription.characterCount == subscribeTo.characters.length
              : subscription.characters.includes('all') ==
                subscribeTo.characters.includes('all'),
          worldsValid: subscribeTo.worlds.every((world) =>
            subscription.worlds.includes(world),
          ),
          eventsValid: subscribeTo.eventNames.every((event) =>
            subscription.eventNames.includes(event),
          ),
          logicalAndValid:
            subscription.logicalAndCharactersWithWorlds ==
            subscribeTo.logicalAndCharactersWithWorlds,
          subscription,
        })),
        filter((v) => Object.values(v).includes(false)),
      )
      .subscribe((v) => {
        logger.log('Subscription altered', v.subscription, details.label);

        if (!v.charactersValid)
          subscriptionAlterCounter.inc({
            connection: details.id,
            key: 'characters',
          });

        if (!v.worldsValid)
          subscriptionAlterCounter.inc({
            connection: details.id,
            key: 'worlds',
          });

        if (!v.eventsValid)
          subscriptionAlterCounter.inc({
            connection: details.id,
            key: 'events',
          });

        if (!v.logicalAndValid)
          subscriptionAlterCounter.inc({
            connection: details.id,
            key: 'logicalAnd',
          });

        resubscribe.next(null);
      });
  }

  connect(): Observable<void> {
    const recordLatency = this.connectionReadyLatency.startTimer({
      connection: this.details.id,
    });

    return from(this.stream.connect()).pipe(tap(() => recordLatency()));
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
