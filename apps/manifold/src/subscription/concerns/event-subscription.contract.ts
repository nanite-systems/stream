import { EventName, Ps2EventMessage } from './event-message.types';
import { EventSubscriptionQuery } from '../entity/event-subscription.query';

export interface EventSubscriptionContract<Event extends Ps2EventMessage> {
  readonly eventName: EventName<Event>;

  readonly world: string;

  update(query: EventSubscriptionQuery): void;

  unsubscribe(): void;
}
