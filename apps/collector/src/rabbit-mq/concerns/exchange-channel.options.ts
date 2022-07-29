import { Options } from 'amqp-connection-manager';
import AssertExchange = Options.AssertExchange;

export interface ExchangeChannelOptions
  extends Pick<AssertExchange, 'durable' | 'autoDelete'> {
  type?: 'direct' | 'topic' | 'headers' | 'fanout' | 'match' | string;
}
