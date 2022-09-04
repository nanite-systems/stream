import { Module } from '@nestjs/common';
import { EventProcessorService } from './services/event-processor.service';
import { CombineStreamPipe } from './pipes/combine-stream.pipe';
import { DuplicateFilterPipe } from './pipes/duplicate-filter.pipe';
import { HashPayloadPipe } from './pipes/hash-payload.pipe';
import { RabbitMqModule } from '../rabbit-mq/rabbit-mq.module';
import { PublisherModule } from '../publisher/publisher.module';

@Module({
  imports: [RabbitMqModule, PublisherModule],
  providers: [
    CombineStreamPipe,
    DuplicateFilterPipe,
    HashPayloadPipe,

    EventProcessorService,
  ],
  exports: [EventProcessorService],
})
export class EventProcessorModule {}
