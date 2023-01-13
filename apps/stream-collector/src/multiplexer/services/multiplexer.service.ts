import { Injectable } from '@nestjs/common';
import { PublisherService } from '../../publisher/services/publisher.service';
import { Stream } from 'ps2census';
import { DuplicateFilter } from '../pipes/duplicate.filter';
import { MultiplexStreamFilter } from '../pipes/multiplex-stream.filter';

@Injectable()
export class MultiplexerService {
  constructor(
    private readonly publisher: PublisherService,
    private readonly multiplexer: MultiplexStreamFilter,
    private readonly duplicateFilter: DuplicateFilter,
  ) {}

  handleEvent(event: Stream.PS2Event, id: string): void {
    const hash = this.hashEvent(event);

    if (
      this.multiplexer.filter(hash, id) &&
      (event.event_name == 'GainExperience' ||
        this.duplicateFilter.filter(hash))
    )
      void this.publisher.publishEvent(event, hash);
  }

  private hashEvent(event: Stream.PS2Event): string {
    let hash = '';

    for (const key in event) hash += `:${event[key]}`;

    return hash.slice(1);
  }
}
