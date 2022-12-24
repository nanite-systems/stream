import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { AmqpConnectionManager } from 'amqp-connection-manager';
import { RABBIT_MQ } from '../../rabbit-mq/constants';
import { EntityManager } from '@mikro-orm/postgresql';
import { EventTrackerConfig } from '../event-tracker.config';
import { Stream } from 'ps2census';
import { EventStat } from '../entities/event-stat.entity';

@Injectable()
export class EventTrackerService implements OnModuleInit {
  private readonly logger = new Logger('EventTracker');

  constructor(
    @Inject(RABBIT_MQ) private readonly rabbit: AmqpConnectionManager,
    private readonly entityManager: EntityManager,
    private readonly config: EventTrackerConfig,
  ) {}

  onModuleInit(): void {
    this.rabbit.createChannel({
      json: true,
      setup: async (channel) => {
        await channel.assertExchange(this.config.eventExchange, 'fanout', {
          durable: false,
        });
        const { queue } = await channel.assertQueue(this.config.healthQueue, {
          expires: 15 * 60 * 1000,
        });

        await channel.bindQueue(queue, this.config.eventExchange, '');
        await channel.consume(queue, async (message) => {
          try {
            const event: Stream.PS2Event = JSON.parse(
              message.content.toString(),
            );

            await this.entityManager
              .fork()
              .createQueryBuilder(EventStat, 't')
              .insert({
                worldId: event.world_id,
                eventName: event.event_name,
                timestamp: event.timestamp,
                events: 1,
              })
              .onConflict(['world_id', 'event_name', 'timestamp'])
              .merge({ events: this.entityManager.raw('t.events + 1') })
              .execute();

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

  private async registerEvent(event: Stream.PS2Event): Promise<void> {
    await this.entityManager
      .fork()
      .createQueryBuilder(EventStat, 't')
      .insert({
        worldId: event.world_id,
        eventName: event.event_name,
        timestamp: event.timestamp,
        events: 1,
      })
      .onConflict(['world_id', 'event_name', 'timestamp'])
      .merge({ events: this.entityManager.raw('t.events + 1') })
      .execute();
  }
}
