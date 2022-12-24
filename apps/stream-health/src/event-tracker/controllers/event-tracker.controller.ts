import {
  CacheInterceptor,
  Controller,
  Get,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { EventStat } from '../entities/event-stat.entity';

@Controller('events')
export class EventTrackerController {
  constructor(private readonly entityManager: EntityManager) {}

  @Get(':world/:event')
  @UseInterceptors(CacheInterceptor)
  async health(
    @Param('world') worldId: string,
    @Param('event') eventName: string,
  ) {
    const offset = 3 * 24 * 3600 * 1000;
    const interval = 60;

    const res = await this.entityManager
      .createQueryBuilder(EventStat)
      .select([
        this.entityManager.raw(
          `to_timestamp(floor((extract('epoch' from timestamp) / ${interval} )) * ${interval}) as timestamp`,
        ),
        'sum(events) as events',
      ])
      .where({
        worldId,
        eventName,
        timestamp: {
          $gte: new Date(Date.now() - offset),
        },
      })
      .orderBy({ '1': 'desc' })
      .groupBy('1')
      .limit(1000)
      .execute('all', false);

    return res.map(({ timestamp, events }) => [
      new Date(timestamp).toISOString(),
      events,
    ]);
  }
}
