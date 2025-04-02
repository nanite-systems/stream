import { Inject, Injectable } from '@nestjs/common';
import { RABBIT_MQ } from '@nss/rabbitmq';
import {
  AmqpConnectionManager,
  Channel,
  ChannelWrapper,
} from 'amqp-connection-manager';
import { DistributorService } from '../services/distributor.service';
import { ConsumeMessage } from 'amqplib';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Histogram } from 'prom-client';
import { config } from '../../config';

@Injectable()
export class StreamChannelFactory {
  constructor(
    @Inject(RABBIT_MQ) private readonly rabbit: AmqpConnectionManager,
    private readonly distributor: DistributorService,
    @InjectMetric('nss_message_latency_milliseconds')
    private readonly messageLatency: Histogram,
  ) {}

  create(): ChannelWrapper {
    return this.rabbit.createChannel({
      setup: async (channel: Channel) => {
        const { queue } = await channel.assertQueue('', {
          exclusive: true,
        });

        await Promise.all([
          channel.bindQueue(queue, config.rabbitmq.streamExchangeName, ''),
          channel.consume(queue, (message) =>
            this.handleMessage(message, channel),
          ),
        ]);
      },
    });
  }

  private handleMessage(message: ConsumeMessage, channel: Channel): void {
    this.messageLatency.observe(
      new Date().getTime() - message.properties.timestamp,
    );

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
