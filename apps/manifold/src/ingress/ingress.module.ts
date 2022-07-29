import { Module } from '@nestjs/common';
import { RabbitMqModule } from '../rabbit-mq/rabbit-mq.module';
import { EventStreamFactory } from './factories/event-stream.factory';
import { DistributerService } from './services/distributer.service';
import { WorldStateModule } from '../world-state/world-state.module';

@Module({
  imports: [RabbitMqModule, WorldStateModule],
  providers: [EventStreamFactory, DistributerService],
  exports: [EventStreamFactory],
})
export class IngressModule {}
