import { ChannelWrapper, Options } from 'amqp-connection-manager';

export class Exchange {
  constructor(
    private readonly channel: ChannelWrapper,
    private readonly exchangeName: string,
  ) {}

  publish(routingKey: string, content: unknown, options: Options.Publish) {
    return this.channel.publish(
      this.exchangeName,
      routingKey,
      content,
      options,
    );
  }
}
