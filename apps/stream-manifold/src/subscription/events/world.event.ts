import { EventContract } from '../concerns/event.contract';
import { EventName, Ps2EventMessage } from '../concerns/event-message.types';
import { EventSubscriptionContract } from '../concerns/event-subscription.contract';
import { Observable, Subscription } from 'rxjs';
import { EventStreamFactory } from '../../ingress/factories/event-stream.factory';
import { EventSubscriptionQuery } from '../entity/event-subscription.query';

export class WorldEventSubscription<Event extends Ps2EventMessage>
  implements EventSubscriptionContract<Event>
{
  private readonly subscription: Subscription;

  constructor(
    readonly eventName: EventName<Event>,
    readonly world: string,
    stream: Observable<Event>,
    callback: (message: Event) => void,
  ) {
    this.subscription = stream.subscribe(callback);
  }

  update() {
    // void
  }

  unsubscribe() {
    this.subscription.unsubscribe();
  }
}

export class WorldEvent<Event extends Ps2EventMessage>
  implements EventContract<Event>
{
  constructor(
    readonly eventName: EventName<Event>,
    private readonly eventStreamFactory: EventStreamFactory,
  ) {}

  matches(query: EventSubscriptionQuery): boolean {
    return query.hasEvent(this.eventName);
  }

  allWorlds(): boolean {
    return false;
  }

  subscribe(
    world: string,
    query: EventSubscriptionQuery,
    callback: (message: Event) => void,
  ): WorldEventSubscription<Event> {
    return new WorldEventSubscription(
      this.eventName,
      world,
      this.eventStreamFactory.get(world, this.eventName),
      callback,
    );
  }
}
