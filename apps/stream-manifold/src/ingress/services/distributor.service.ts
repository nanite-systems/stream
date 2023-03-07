import { Injectable } from '@nestjs/common';
import { EventStreamFactory } from '../factories/event-stream.factory';
import { ServiceStateService } from '../../service-state/services/service-state.service';
import { STREAM_MESSAGE_TYPE } from '@nss/ess-concerns';

@Injectable()
export class DistributorService {
  constructor(
    private readonly eventStreamFactory: EventStreamFactory,
    private readonly serviceStateService: ServiceStateService,
  ) {}

  process(message: any, type: STREAM_MESSAGE_TYPE): void {
    switch (type) {
      case STREAM_MESSAGE_TYPE.serviceState:
        this.serviceStateService.registerState(message);
        break;
      case STREAM_MESSAGE_TYPE.event:
        this.eventStreamFactory
          .get(message.world_id, message.event_name)
          .next(message);
        break;
    }
  }
}
