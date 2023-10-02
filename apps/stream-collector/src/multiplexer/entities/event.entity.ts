import { EventPayload } from '@nss/ess-concerns';
import { ConnectionDetails } from '../../census/utils/connection-details';

export class EventEntity {
  constructor(
    readonly payload: EventPayload,
    readonly connectionDetails: ConnectionDetails,
    readonly hash: string,
    readonly sightingConnection: number,
    readonly sightingMultiplexed: number,
  ) {}
}
