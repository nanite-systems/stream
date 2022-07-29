import { Inject, Injectable } from '@nestjs/common';
import { Stream } from 'ps2census';
import { WorldState } from '../../world-tracker/concerns/world-state';
import { Exchange } from '../../rabbit-mq/utils/exchange';
import { PUBLISH_EXCHANGE } from '../../rabbit-mq/constants';

@Injectable()
export class PublisherService {
  constructor(
    @Inject(PUBLISH_EXCHANGE) private readonly publishExchange: Exchange,
  ) {}

  async publishEvent(event: Stream.PS2Event): Promise<void> {
    const { world_id, event_name } = event;
    await this.publishExchange.publish(
      event,
      `event.${world_id}.${event_name}`,
    );
  }

  async publishWorldState(worldState: WorldState): Promise<void> {
    const { worldId } = worldState;

    await this.publishExchange.publish(worldState, `world-state.${worldId}`);
  }
}
