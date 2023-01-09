import { Module } from '@nestjs/common';
import { EventStreamFactory } from './factories/event-stream.factory';
import { ServiceStateModule } from '../service-state/service-state.module';
import { RabbitMqModule } from '@nss/rabbitmq';
import { DistributorService } from './services/distributor.service';

@Module({
  imports: [RabbitMqModule, ServiceStateModule],
  providers: [EventStreamFactory, DistributorService],
  exports: [EventStreamFactory],
})
export class IngressModule {}
