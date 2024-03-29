import { Inject, Injectable, Optional } from '@nestjs/common';
import { ServiceState, STREAM_MESSAGE_TYPE } from '@nss/ess-concerns';
import { EventEntity } from '../../multiplexer/entities/event.entity';
import { MultiplexerService } from '../../multiplexer/services/multiplexer.service';
import { Exchange } from '../utils/exchange';
import { DUPLICATE_EXCHANGE, STREAM_EXCHANGE } from '../constant';
import { ServiceTrackerService } from '../../service-tracker/services/service-tracker.service';

export const PUBLISHER_OPTIONS = Symbol('provide:publisher_options');

export interface PublisherServiceOptions {
  exchangeName: string;
  duplicateExchangeName: string;
  appId: string;
}

@Injectable()
export class PublisherService {
  constructor(
    private readonly multiplexer: MultiplexerService,
    private readonly serviceTracker: ServiceTrackerService,
    @Inject(STREAM_EXCHANGE) private readonly streamExchange: Exchange,
    @Optional()
    @Inject(DUPLICATE_EXCHANGE)
    private readonly duplicateExchange: Exchange,
    @Inject(PUBLISHER_OPTIONS)
    private readonly options: PublisherServiceOptions,
  ) {
    this.multiplexer
      .observeStream()
      .subscribe((event) => this.publishEvent(event));

    this.serviceTracker
      .observeServiceState()
      .subscribe((state) => this.publishState(state));

    if (this.duplicateExchange)
      this.multiplexer
        .observeDuplicates()
        .subscribe((event) => this.publishDuplicate(event));
  }

  private async publishEvent(event: EventEntity): Promise<void> {
    const { payload, hash } = event;
    const { world_id, event_name } = payload;

    await this.streamExchange.publish(
      `${STREAM_MESSAGE_TYPE.event}.${world_id}.${event_name}`,
      payload,
      {
        timestamp: new Date().getTime(),
        appId: this.options.appId,
        type: STREAM_MESSAGE_TYPE.event,
        headers: {
          'x-message-deduplication': hash,
        },
      },
    );
  }

  private async publishState(state: ServiceState): Promise<void> {
    const { worldId } = state;

    await this.duplicateExchange.publish(
      `${STREAM_MESSAGE_TYPE.serviceState}.${worldId}`,
      state,
      {
        timestamp: new Date().getTime(),
        appId: this.options.appId,
        type: STREAM_MESSAGE_TYPE.serviceState,
      },
    );
  }

  private async publishDuplicate(event: EventEntity): Promise<void> {
    const { payload } = event;
    const { world_id, event_name } = payload;

    await this.duplicateExchange.publish(
      `${STREAM_MESSAGE_TYPE.event}.${world_id}.${event_name}`,
      payload,
      {
        timestamp: new Date().getTime(),
        appId: this.options.appId,
        type: STREAM_MESSAGE_TYPE.event,
      },
    );
  }
}
