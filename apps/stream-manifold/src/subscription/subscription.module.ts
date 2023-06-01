import { Module } from '@nestjs/common';
import { EventService } from './services/event.service';
import { EventSubscriptionQuery } from './entity/event-subscription.query';
import { EventSubscriptionService } from './services/event-subscription.service';
import { EnvironmentsModule } from '../environments/environments.module';
import { IngressModule } from '../ingress/ingress.module';
import { makeCounterProvider } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [IngressModule, EnvironmentsModule],
  providers: [
    EventService,
    EventSubscriptionService,
    EventSubscriptionQuery,

    makeCounterProvider({
      name: 'nss_subscription_count',
      help: 'counter of subscriptions made',
      labelNames: ['world', 'event', 'type'],
    }),
    makeCounterProvider({
      name: 'nss_subscription_total',
      help: 'current number of subscription to a certain event stream',
      labelNames: ['world', 'event', 'type'],
    }),
  ],
  exports: [EventSubscriptionService, EventSubscriptionQuery],
})
export class SubscriptionModule {}
