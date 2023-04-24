import { EventEntity } from '../entities/event.entity';
import { DuplicateService } from '../services/duplicate.service';
import { Injectable } from '@nestjs/common';
import { EventPayload } from '@nss/ess-concerns';

@Injectable()
export class EventEntityFactory {
  private readonly duplicateFilters = new WeakMap<any, DuplicateService>();
  private readonly multiplexer = new DuplicateService(20 * 1000);

  create(payload: EventPayload, connection: any): EventEntity {
    const hash = this.hashEvent(payload);
    const sightingConnection =
      this.getDuplicateService(connection).checkAndIncr(hash);
    const sightingMultiplexed = this.multiplexer.checkAndIncr(
      `${sightingConnection}::${hash}`,
    );

    return new EventEntity(
      payload,
      connection,
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

  private getDuplicateService(connection: any): DuplicateService {
    if (this.duplicateFilters.has(connection))
      return this.duplicateFilters.get(connection);

    const filter = new DuplicateService(20 * 1000);
    this.duplicateFilters.set(connection, filter);

    return filter;
  }
}
