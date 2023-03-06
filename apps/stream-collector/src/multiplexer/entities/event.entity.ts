import { EventPayload } from '../../census/concerns/event-payload.type';

export class EventEntity {
  constructor(
    readonly payload: EventPayload,
    readonly connection: any,
    readonly hash: string,
    readonly sightingConnection: number,
    readonly sightingMultiplexed: number,
  ) {}
}
