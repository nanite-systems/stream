import { Inject, Injectable } from '@nestjs/common';
import { RABBIT_MQ } from '../constants';
import { AmqpConnectionManager, ChannelWrapper } from 'amqp-connection-manager';
import { Exchange } from '../utils/exchange';

@Injectable()
export class PublishExchangeFactory {
  constructor(
    @Inject(RABBIT_MQ) private readonly rabbit: AmqpConnectionManager,
  ) {}

  create(name: string): Exchange {
    return new Exchange(name, this.createChannel(name));
  }

  private createChannel(name: string): ChannelWrapper {
    return this.rabbit.createChannel({
      json: true,
      setup: async (channel) => {
        await Promise.all([
          channel.assertExchange(name, 'fanout', { durable: false }),
        ]);
      },
    });
  }
}
