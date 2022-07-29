import { Module } from '@nestjs/common';
import { PublisherService } from './services/publisher.service';
import { RabbitMqModule } from '../rabbit-mq/rabbit-mq.module';

@Module({
  imports: [RabbitMqModule],
  providers: [PublisherService],
  exports: [PublisherService],
})
export class PublisherModule {}
