import { EventContract } from '../concerns/event.contract';
import {
  CharacterEventMessage as CharacterEventMessage,
  EventName,
} from '../concerns/event-message.types';
import { EventSubscriptionContract } from '../concerns/event-subscription.contract';
import { filter, Observable, Subscription } from 'rxjs';
import { EventStreamFactory } from '../../ingress/factories/event-stream.factory';
import { EventSubscriptionQuery } from '../entity/event-subscription.query';

export class CharacterEventSubscription<Event extends CharacterEventMessage>
  implements EventSubscriptionContract<Event>
{
  private readonly subscription: Subscription;

  constructor(
    readonly eventName: EventName<Event>,
    readonly world: string,
    query: EventSubscriptionQuery,
    stream: Observable<Event>,
    callback: (message: Event) => void,
  ) {
    this.subscription = stream
      .pipe(filter((message) => query.hasCharacter(message.character_id)))
      .subscribe(callback);
  }

  update() {
    // void
  }

  unsubscribe() {
    this.subscription.unsubscribe();
  }
}

export class CharacterEvent<Event extends CharacterEventMessage>
  implements EventContract<Event>
{
  constructor(
    readonly eventName: EventName<Event>,
    private readonly eventStreamFactory: EventStreamFactory,
    private readonly ignoreLogicalAnd = false,
  ) {}

  matches(query: EventSubscriptionQuery): boolean {
    return query.hasEvent(this.eventName);
  }

  allWorlds(query: EventSubscriptionQuery): boolean {
    return !query.logicalAndCharactersWithWorlds;
  }

  subscribe(
    world: string,
    query: EventSubscriptionQuery,
    callback: (message: Event) => void,
  ): CharacterEventSubscription<Event> {
    return new CharacterEventSubscription(
      this.eventName,
      world,
      query,
      this.eventStreamFactory.get(world, this.eventName),
      callback,
    );
  }
}
