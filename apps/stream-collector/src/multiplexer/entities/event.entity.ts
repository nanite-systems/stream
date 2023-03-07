import { EventPayload } from '@nss/ess-concerns';

export class EventEntity {
  constructor(
    readonly payload: EventPayload,
    readonly connection: any,
    readonly hash: string,
    readonly sightingConnection: number,
    readonly sightingMultiplexed: number,
  ) {}
}
