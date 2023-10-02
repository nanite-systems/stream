import { EventEntity } from '../entities/event.entity';
import { DuplicateService } from '../services/duplicate.service';
import { Injectable } from '@nestjs/common';
import { EventPayload } from '@nss/ess-concerns';
import { ConnectionDetails } from '../../census/utils/connection-details';

@Injectable()
export class EventEntityFactory {
  private readonly duplicateFilters = new Map<number, DuplicateService>();
  private readonly multiplexer = new DuplicateService(20 * 1000);

  create(
    payload: EventPayload,
    connectionDetails: ConnectionDetails,
  ): EventEntity {
    const hash = this.hashEvent(payload);
    const sightingConnection =
      this.getDuplicateService(connectionDetails).checkAndIncr(hash);
    const sightingMultiplexed = this.multiplexer.checkAndIncr(
      `${sightingConnection}::${hash}`,
    );

    return new EventEntity(
      payload,
      connectionDetails,
      hash,
      sightingConnection,
      sightingMultiplexed,
    );
  }

  private hashEvent(event: EventPayload): string {
    let hash = '';

    for (const key in event) hash += `:${event[key]}`;

    return hash.slice(1);
  }

  private getDuplicateService({ id }: ConnectionDetails): DuplicateService {
    if (this.duplicateFilters.has(id)) return this.duplicateFilters.get(id);

    const filter = new DuplicateService(20 * 1000);
    this.duplicateFilters.set(id, filter);

    return filter;
  }
}
