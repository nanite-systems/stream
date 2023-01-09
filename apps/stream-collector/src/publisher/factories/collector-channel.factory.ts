import { Inject, Injectable } from '@nestjs/common';
import { RABBIT_MQ } from '@nss/rabbitmq';
import { AmqpConnectionManager, ChannelWrapper } from 'amqp-connection-manager';

@Injectable()
export class CollectorChannelFactory {
  constructor(
    @Inject(RABBIT_MQ) private readonly rabbit: AmqpConnectionManager,
  ) {}

  create(): ChannelWrapper {
    return this.rabbit.createChannel({
      json: true,
    });
  }
}
