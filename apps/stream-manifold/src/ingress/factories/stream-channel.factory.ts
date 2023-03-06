import { Inject, Injectable } from '@nestjs/common';
import { RABBIT_MQ } from '@nss/rabbitmq';
import {
  AmqpConnectionManager,
  Channel,
  ChannelWrapper,
} from 'amqp-connection-manager';
import { DistributorService } from '../services/distributor.service';
import { ConsumeMessage } from 'amqplib';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StreamChannelFactory {
  constructor(
    @Inject(RABBIT_MQ) private readonly rabbit: AmqpConnectionManager,
    private readonly distributor: DistributorService,
    private readonly config: ConfigService,
  ) {}

  create(): ChannelWrapper {
    return this.rabbit.createChannel({
      setup: async (channel) => {
        const { queue } = channel.assertQueue(null, {
          exclusive: true,
        });

        await Promise.all([
          channel.bindQueue(queue, this.config.get('rabbitmq.exchangeName')),
          channel.consume(queue, (message) =>
            this.handleMessage(message, channel),
          ),
        ]);
      },
    });
  }

  private handleMessage(message: ConsumeMessage, channel: Channel): void {
    try {
      const payload = JSON.parse(message.content.toString());

      channel.ack(message);
      this.distributor.process(payload, message.properties.type);
    } catch (err) {
      if (err instanceof SyntaxError) channel.reject(message);
      else throw err;
    }
  }
}
