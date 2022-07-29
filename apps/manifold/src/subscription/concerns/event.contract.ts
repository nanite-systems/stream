import { EventName, Ps2EventMessage } from './event-message.types';
import { EventSubscriptionContract } from './event-subscription.contract';
import { EventSubscriptionQuery } from '../entity/event-subscription.query';

export interface EventContract<Event extends Ps2EventMessage> {
  readonly eventName: EventName<Event>;

  matches(query: EventSubscriptionQuery): boolean;

  allWorlds(query: EventSubscriptionQuery): boolean;

  subscribe(
    world: string,
    query: EventSubscriptionQuery,
    callback: (message: Event) => void,
  ): EventSubscriptionContract<Event>;
}
