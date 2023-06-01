import { Injectable, Scope } from '@nestjs/common';
import { EventSubscriptionQuery } from '../entity/event-subscription.query';
import { Environment } from '../../environments/utils/environment';
import { Observable, Subject } from 'rxjs';
import { EventSubscriptionContract } from '../concerns/event-subscription.contract';
import { EventName, Ps2EventMessage } from '../concerns/event-message.types';
import { EventContract } from '../concerns/event.contract';
import { EventService } from './event.service';
import { Stream } from 'ps2census';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Gauge } from 'prom-client';

@Injectable({ scope: Scope.REQUEST })
export class EventSubscriptionService {
  private readonly subscriptionMap = new Map<
    string,
    EventSubscriptionContract<Ps2EventMessage>
  >();

  private readonly _stream = new Subject<Stream.PS2Event>();

  constructor(
    readonly query: EventSubscriptionQuery,
    private readonly eventService: EventService,
    private readonly environment: Environment,
    @InjectMetric('nss_subscription_count')
    private readonly subscriptionCounter: Counter,
    @InjectMetric('nss_subscription_total')
    private readonly subscriptionTotal: Gauge,
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
      for (const [, subscription] of this.subscriptionMap) {
        this.subscriptionCounter.inc({
          world: subscription.world,
          event: subscription.eventName,
          type: 'Unsubscribe',
        });

        subscription.unsubscribe();
      }

      this.subscriptionMap.clear();
    });
  }

  get stream(): Observable<Stream.PS2Event> {
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

    if (subscription) {
      subscription.update(this.query);
    } else {
      this.subscriptionCounter.inc({
        world,
        event: event.eventName,
        type: 'Subscribe',
      });

      this.subscriptionMap.set(
        key,
        event.subscribe(world, this.query, (payload) =>
          this._stream.next(payload),
        ),
      );
    }
  }

  unsubscribe(world: string, event: EventContract<Ps2EventMessage>): void {
    const key = this.createKey(world, event.eventName);

    if (!this.subscriptionMap.has(key)) return;

    this.subscriptionCounter.inc({
      world,
      event: event.eventName,
      type: 'Unsubscribe',
    });

    this.subscriptionMap.get(key).unsubscribe();
    this.subscriptionMap.delete(key);
  }

  private createKey(world: string, event: EventName): string {
    return `${world}:${event}`;
  }
}
