import { FactoryInterface } from '../../utils/factory.interface';
import { merge, Observable } from 'rxjs';
import { Injectable, Scope } from '@nestjs/common';
import { BaseStreamFactory } from './base-stream.factory';
import { EventSubscriptionService } from '../../subscription/services/event-subscription.service';

@Injectable({ scope: Scope.REQUEST })
export class CensusStreamFactory implements FactoryInterface<Observable<any>> {
  constructor(
    private readonly baseStreamFactory: BaseStreamFactory,
    private readonly eventSubscriptionService: EventSubscriptionService,
  ) {}

  create(): Observable<any> {
    return merge(
      this.baseStreamFactory.create(),
      this.eventSubscriptionService.stream,
    );
  }
}
