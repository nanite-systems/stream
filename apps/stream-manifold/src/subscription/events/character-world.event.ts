import { EventContract } from '../concerns/event.contract';
import {
  CharacterEventMessage as CharacterEventMessage,
  EventName,
} from '../concerns/event-message.types';
import { EventSubscriptionContract } from '../concerns/event-subscription.contract';
import { filter, Observable, Subscription } from 'rxjs';
import { EventStreamFactory } from '../../ingress/factories/event-stream.factory';
import { EventSubscriptionQuery } from '../entity/event-subscription.query';

export class CharacterWorldEventSubscription<
  Event extends CharacterEventMessage,
> implements EventSubscriptionContract<Event>
{
  private readonly subscription: Subscription;

  private filter: (message: Event) => boolean;

  constructor(
    readonly eventName: EventName<Event>,
    readonly world: string,
    query: EventSubscriptionQuery,
    stream: Observable<Event>,
    callback: (message: Event) => void,
  ) {
    this.update(query);

    this.subscription = stream
      .pipe(filter((message) => this.filter(message)))
      .subscribe(callback);
  }

  update(query: EventSubscriptionQuery): void {
    this.filter = query.hasWorld(this.world)
      ? () => true
      : (message) => query.hasCharacter(message.character_id);
  }

  unsubscribe() {
    this.subscription.unsubscribe();
  }
}

export class CharacterWorldEvent<Event extends CharacterEventMessage>
  implements EventContract<Event>
{
  constructor(
    readonly eventName: EventName<Event>,
    private readonly eventStreamFactory: EventStreamFactory,
  ) {}

  matches(query: EventSubscriptionQuery): boolean {
    return query.hasEvent(this.eventName);
  }

  allWorlds(query: EventSubscriptionQuery): boolean {
    return query.noCharacters > 0;
  }

  subscribe(
    world: string,
    query: EventSubscriptionQuery,
    callback: (message: Event) => void,
  ): CharacterWorldEventSubscription<Event> {
    return new CharacterWorldEventSubscription(
      this.eventName,
      world,
      query,
      this.eventStreamFactory.get(world, this.eventName),
      callback,
    );
  }
}
