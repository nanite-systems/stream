import { FactoryInterface } from '../../utils/factory.interface';
import { map, merge, Observable, tap } from 'rxjs';
import { Injectable, Scope } from '@nestjs/common';
import { BaseStreamFactory } from './base-stream.factory';
import { EventSubscriptionService } from '../../subscription/services/event-subscription.service';
import { Stream } from 'ps2census';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';

@Injectable({ scope: Scope.REQUEST })
export class CensusStreamFactory
  implements FactoryInterface<Observable<Stream.CensusMessage>>
{
  constructor(
    private readonly baseStreamFactory: BaseStreamFactory,
    private readonly eventSubscriptionService: EventSubscriptionService,
    @InjectMetric('nss_message_count')
    private readonly messageCounter: Counter,
  ) {}

  create(): Observable<Stream.CensusMessageWithoutEcho> {
    return merge(
      this.baseStreamFactory.create(),
      this.eventSubscriptionService.stream.pipe(
        tap((event) =>
          this.messageCounter.inc({
            world: event.world_id,
            event: event.event_name,
          }),
        ),
        map(
          (payload): Stream.CensusMessages.ServiceMessage => ({
            payload,
            service: 'event',
            type: 'serviceMessage',
          }),
        ),
      ),
    );
  }
}
