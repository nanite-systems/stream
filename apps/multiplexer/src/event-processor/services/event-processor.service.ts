import { Injectable } from '@nestjs/common';
import { CombineStreamPipe } from '../pipes/combine-stream.pipe';
import { DuplicateFilterPipe } from '../pipes/duplicate-filter.pipe';
import { HashPayloadPipe } from '../pipes/hash-payload.pipe';
import { PublisherService } from '../../publisher/services/publisher.service';
import { EventMessage } from '../concerns/stream-messages.types';

@Injectable()
export class EventProcessorService {
  constructor(
    private readonly combineStreamPipe: CombineStreamPipe,
    private readonly duplicateFilterPipe: DuplicateFilterPipe,
    private readonly hashPayloadPipe: HashPayloadPipe,
    private readonly publisherService: PublisherService,
  ) {}

  processEvent(event: EventMessage): void {
    const hashedEvent = this.hashPayloadPipe.handle(event);

    if (!this.duplicateFilterPipe.handle(hashedEvent)) return;
    if (!this.combineStreamPipe.handle(hashedEvent)) return;

    void this.publisherService.publishEvent(event.payload);
  }
}
