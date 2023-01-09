import { Inject, Injectable } from '@nestjs/common';
import { PublisherConfig } from '../publisher.config';
import { ChannelWrapper } from 'amqp-connection-manager';
import { COLLECTOR_CHANNEL } from '../constant';
import { NssStreamMessages, STREAM_MESSAGE_TYPE } from '@nss/rabbitmq';

@Injectable()
export class PublisherService {
  constructor(
    @Inject(COLLECTOR_CHANNEL) private readonly channel: ChannelWrapper,
    private readonly config: PublisherConfig,
  ) {}

  async publishServiceState(
    state: NssStreamMessages.ServiceState,
  ): Promise<void> {
    const timestamp = new Date().getTime();

    await this.channel.publish(
      this.config.exchangeName,
      `${STREAM_MESSAGE_TYPE.serviceState}.${state.worldId}`,
      state,
      {
        timestamp,
        appId: this.config.appId,
        type: STREAM_MESSAGE_TYPE.serviceState,
        headers: {
          'x-message-deduplication': `${Math.floor(timestamp / 5000)}:${
            state.worldId
          }:${state.online}`,
        },
      },
    );
  }

  async publishEvent(
    payload: NssStreamMessages.Event,
    hash: string,
  ): Promise<void> {
    const { world_id, event_name } = payload;

    await this.channel.publish(
      this.config.exchangeName,
      `${STREAM_MESSAGE_TYPE.event}.${world_id}.${event_name}`,
      payload,
      {
        timestamp: new Date().getTime(),
        appId: this.config.appId,
        type: STREAM_MESSAGE_TYPE.event,
        headers: {
          'x-message-deduplication': hash,
        },
      },
    );
  }
}
