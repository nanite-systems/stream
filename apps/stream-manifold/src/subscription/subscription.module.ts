import { Module } from '@nestjs/common';
import { EventService } from './services/event.service';
import { EventSubscriptionQuery } from './entity/event-subscription.query';
import { EventSubscriptionService } from './services/event-subscription.service';
import { EnvironmentsModule } from '../environments/environments.module';
import { IngressModule } from '../ingress/ingress.module';

@Module({
  imports: [IngressModule, EnvironmentsModule],
  providers: [EventService, EventSubscriptionService, EventSubscriptionQuery],
  exports: [EventSubscriptionService, EventSubscriptionQuery],
})
export class SubscriptionModule {}
