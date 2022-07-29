import { Injectable, Scope } from '@nestjs/common';
import { EventSubscriptionQuery } from '../entity/event-subscription.query';
import { Environment } from '../../environments/utils/environment';
import { Observable, Subject } from 'rxjs';
import { EventSubscriptionContract } from '../concerns/event-subscription.contract';
import { EventName, Ps2EventMessage } from '../concerns/event-message.types';
import { EventContract } from '../concerns/event.contract';
import { EventService } from './event.service';
import { Stream } from 'ps2census';

@Injectable({ scope: Scope.REQUEST })
export class EventSubscriptionService {
  private readonly subscriptionMap = new Map<
    string,
    EventSubscriptionContract<Ps2EventMessage>
  >();

  private readonly _stream =
    new Subject<Stream.CensusMessages.ServiceMessage>();

  constructor(
    readonly query: EventSubscriptionQuery,
    private readonly eventService: EventService,
    private readonly environment: Environment,
  ) {
    this.prepareListeners();
  }

  private prepareListeners(): void {
    this.query.on('subscribe', () => {
      this.update();
    });

    this.query.on('unsubscribe', () => {
      this.update();
    });

    this.query.on('unsubscribeAll', () => {
      for (const [, subscription] of this.subscriptionMap)
        subscription.unsubscribe();

      this.subscriptionMap.clear();
    });
  }

  get stream(): Observable<Stream.CensusMessages.ServiceMessage> {
    return this._stream;
  }

  update(): void {
    for (const event of this.eventService.events) {
      const eventCheck = event.matches(this.query);
      const allWorldCheck = event.allWorlds(this.query);

      for (const world of this.environment.worlds) {
        const worldCheck = allWorldCheck || this.query.hasWorld(world);

        if (eventCheck && worldCheck) this.subscribe(world, event);
        else this.unsubscribe(world, event);
      }
    }
  }

  subscribe(world: string, event: EventContract<Ps2EventMessage>): void {
    const key = this.createKey(world, event.eventName);
    const subscription = this.subscriptionMap.get(key);

    if (subscription) subscription.update(this.query);
    else
      this.subscriptionMap.set(
        key,
        event.subscribe(world, this.query, (payload) =>
          this._stream.next({
            payload,
            service: 'event',
            type: 'serviceMessage',
          }),
        ),
      );
  }

  unsubscribe(world: string, event: EventContract<Ps2EventMessage>): void {
    const key = this.createKey(world, event.eventName);

    this.subscriptionMap.get(key)?.unsubscribe();
    this.subscriptionMap.delete(key);
  }

  private createKey(world: string, event: EventName): string {
    return `${world}:${event}`;
  }
}
