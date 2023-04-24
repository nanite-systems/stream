import { Inject, Injectable } from '@nestjs/common';
import { RABBIT_MQ } from '@nss/rabbitmq';
import { AmqpConnectionManager } from 'amqp-connection-manager';
import { Exchange } from '../utils/exchange';

@Injectable()
export class ExchangeFactory {
  constructor(
    @Inject(RABBIT_MQ) private readonly rabbit: AmqpConnectionManager,
  ) {}

  create(name: string, type: string, options): Exchange {
    const channel = this.rabbit.createChannel({
      json: true,
      setup: async (channel) => {
        await channel.assertExchange(name, type, options);
      },
    });

    return new Exchange(channel, name);
  }
}
