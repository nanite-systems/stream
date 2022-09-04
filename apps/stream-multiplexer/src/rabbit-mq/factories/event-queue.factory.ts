import { Inject, Injectable, Logger } from '@nestjs/common';
import { RABBIT_MQ } from '../constants';
import { AmqpConnectionManager, ChannelWrapper } from 'amqp-connection-manager';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class EventQueueFactory {
  private readonly logger = new Logger('EventQueue');

  constructor(
    @Inject(RABBIT_MQ) private readonly rabbit: AmqpConnectionManager,
  ) {}

  create(name: string): Observable<any> {
    const subject = new Subject();
    this.createChannel(name, subject);

    return subject;
  }

  private createChannel(name: string, subject: Subject<any>): ChannelWrapper {
    return this.rabbit.createChannel({
      json: true,
      setup: async (channel) => {
        await channel.assertExchange(name, 'fanout', { durable: false });
        const { queue } = await channel.assertQueue('', {
          durable: false,
          exclusive: true,
        });

        await channel.bindQueue(queue, name, '');
        await channel.consume(queue, (message) => {
          try {
            const event = JSON.parse(message.content.toString());

            subject.next(event);
            channel.ack(message);
          } catch (err) {
            if (err instanceof SyntaxError)
              this.logger.warn(
                `Received malformed message: ${message.content.toString()}`,
              );
            else throw err;
          }
        });
      },
    });
  }
}
