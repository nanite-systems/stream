import { Inject, Injectable } from '@nestjs/common';
import { RABBIT_MQ } from '../constants';
import { AmqpConnectionManager, ChannelWrapper } from 'amqp-connection-manager';
import { Exchange } from '../utils/exchange';
import { ExchangeChannelOptions } from '../concerns/exchange-channel.options';

@Injectable()
export class ExchangeFactory {
  constructor(
    @Inject(RABBIT_MQ) private readonly rabbit: AmqpConnectionManager,
  ) {}

  create(name: string, options: ExchangeChannelOptions = {}): Exchange {
    return new Exchange(name, this.setupChannel(name, options));
  }

  private setupChannel(
    name: string,
    { type, ...options }: ExchangeChannelOptions,
  ): ChannelWrapper {
    return this.rabbit.createChannel({
      json: true,
      setup: (channel) => {
        return channel.assertExchange(name, type, options);
      },
    });
  }
}
