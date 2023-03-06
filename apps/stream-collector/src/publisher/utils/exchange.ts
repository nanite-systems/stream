import { ChannelWrapper } from 'amqp-connection-manager';
import { PublishOptions } from 'amqp-connection-manager/dist/esm/ChannelWrapper';

export class Exchange {
  constructor(
    private readonly channel: ChannelWrapper,
    private readonly exchangeName: string,
  ) {}

  publish(routingKey: string, content: unknown, options: PublishOptions) {
    return this.channel.publish(
      this.exchangeName,
      routingKey,
      content,
      options,
    );
  }
}
