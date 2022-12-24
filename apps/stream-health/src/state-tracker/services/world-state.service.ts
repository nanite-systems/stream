import { Inject, Injectable } from '@nestjs/common';
import { RestClient } from 'ps2census/dist/rest/rest.client';
import { Cron } from '@nestjs/schedule';
import { EntityManager } from '@mikro-orm/postgresql';
import { WorldState } from '../entities/world-state.entity';
import { PC_REST, PS4EU_REST, PS4US_REST } from '../../census/constants';

@Injectable()
export class WorldStateService {
  private static readonly IGNORE = ['24', '25'];

  constructor(
    @Inject(PC_REST) private readonly pcRest: RestClient,
    @Inject(PS4EU_REST) private readonly ps4euRest: RestClient,
    @Inject(PS4US_REST) private readonly ps4usRest: RestClient,
    private readonly entityManager: EntityManager,
  ) {}

  @Cron('0 * * * * *')
  trackWorldStates(): void {
    this.trackWorldStatesFor(this.pcRest);
    this.trackWorldStatesFor(this.ps4euRest);
    this.trackWorldStatesFor(this.ps4usRest);
  }

  async trackWorldStatesFor(rest: RestClient): Promise<void> {
    try {
      const worlds = await rest.getQueryBuilder('world').limit(100).get();

      for (const world of worlds)
        if (!WorldStateService.IGNORE.includes(world.world_id))
          this.trackWorldState(world.world_id, world.state == 'online');
    } catch (err) {
      console.log(err);
    }
  }

  trackWorldState(worldId: string, up: boolean): void {
    this.entityManager.transactional(async (em) => {
      const prev = await em.findOne(
        WorldState,
        { worldId },
        { orderBy: { timestamp: 'desc' } },
      );

      if (!prev || prev.up != up)
        em.persist(
          new WorldState({
            worldId,
            up,
            timestamp: new Date(new Date().toUTCString()),
          }),
        );
    });
  }
}
