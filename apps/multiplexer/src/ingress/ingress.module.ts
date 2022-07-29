import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { RabbitMqModule } from '../rabbit-mq/rabbit-mq.module';
import { EVENT_QUEUE } from '../rabbit-mq/constants';
import { EventProcessorModule } from '../event-processor/event-processor.module';
import { Observable } from 'rxjs';
import { EventProcessorService } from '../event-processor/services/event-processor.service';
import { EventMessage } from '../event-processor/concerns/stream-messages.types';

@Module({
  imports: [RabbitMqModule, EventProcessorModule],
})
export class IngressModule implements OnModuleInit {
  constructor(
    @Inject(EVENT_QUEUE)
    private readonly eventQueue: Observable<EventMessage>,
    private readonly eventProcessor: EventProcessorService,
  ) {}

  onModuleInit(): void {
    this.eventQueue.subscribe((event) => {
      this.eventProcessor.processEvent(event);
    });
  }
}
