import { EventContract } from '../concerns/event.contract';
import { GainExperienceMessage } from '../concerns/event-message.types';
import { EventSubscriptionContract } from '../concerns/event-subscription.contract';
import { filter, Observable, Subscription } from 'rxjs';
import { EventStreamFactory } from '../../ingress/factories/event-stream.factory';
import { EventSubscriptionQuery } from '../entity/event-subscription.query';
import { iterate } from 'iterare';

export class GainExperienceEventSubscription<
  Event extends GainExperienceMessage,
> implements EventSubscriptionContract<Event>
{
  private readonly subscription: Subscription;

  private filter: (message: Event) => boolean;

  private readonly experienceIds = new Set<string>();

  readonly eventName = 'GainExperience';

  constructor(
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

  update(query: EventSubscriptionQuery) {
    const allEvents = query.hasEvent('GainExperience');

    this.experienceIds.clear();

    if (allEvents) {
      this.filter = (message) => query.hasCharacter(message.character_id);
    } else {
      for (const event of query.events) {
        const match = event.match(/^GainExperience_experience_id_(\d+)$/);

        if (match) this.experienceIds.add(match[1]);
      }

      this.filter = (message) =>
        this.experienceIds.has(message.experience_id) &&
        query.hasCharacter(message.character_id);
    }
  }

  unsubscribe() {
    this.subscription.unsubscribe();
  }
}

export class GainExperienceEvent<Event extends GainExperienceMessage>
  implements EventContract<Event>
{
  readonly eventName = 'GainExperience';

  constructor(private readonly eventStreamFactory: EventStreamFactory) {}

  matches(query: EventSubscriptionQuery): boolean {
    return (
      query.hasEvent(this.eventName) ||
      iterate(query.events).some((event) =>
        /^GainExperience_experience_id_\d+$/.test(event),
      )
    );
  }

  allWorlds(query: EventSubscriptionQuery): boolean {
    return !query.logicalAndCharactersWithWorlds;
  }

  subscribe(
    world: string,
    query: EventSubscriptionQuery,
    callback: (message: Event) => void,
  ): GainExperienceEventSubscription<Event> {
    return new GainExperienceEventSubscription(
      world,
      query,
      this.eventStreamFactory.get(world, this.eventName),
      callback,
    );
  }
}
