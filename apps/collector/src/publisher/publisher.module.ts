import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { PublisherService } from './services/publisher.service';
import { CensusModule } from '../census/census.module';
import { RabbitMqModule } from '../rabbit-mq/rabbit-mq.module';
import { Stream } from 'ps2census';
import { ConfigModule } from '@census-reworked/nestjs-utils';
import { PublisherConfig } from './publisher.config';

@Module({
  imports: [
    ConfigModule.forFeature([PublisherConfig]),
    CensusModule,
    RabbitMqModule,
  ],
  providers: [PublisherService],
})
export class PublisherModule implements OnApplicationBootstrap {
  constructor(
    private readonly stream: Stream.Client,
    private readonly publisher: PublisherService,
  ) {}

  onApplicationBootstrap(): void {
    this.stream.on('message', (message) => {
      if (
        message.service == 'event' &&
        message.type == 'serviceMessage' &&
        'event_name' in message.payload
      ) {
        void this.publisher.publish(message.payload);
      }
    });
  }
}
