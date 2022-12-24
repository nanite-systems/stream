import { Controller, Get, Param, Scope } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { WorldState } from '../entities/world-state.entity';

@Controller({ path: 'worlds', scope: Scope.REQUEST })
export class WorldStateController {
  constructor(private readonly entityManager: EntityManager) {}

  @Get()
  state() {
    return this.entityManager
      .createQueryBuilder(WorldState)
      .distinctOn('world_id')
      .orderBy({ worldId: 'asc', timestamp: 'desc' })
      .getResult();
  }

  @Get(':world')
  history(@Param('world') worldId: string) {
    return this.entityManager.find(
      WorldState,
      { worldId },
      { orderBy: { timestamp: 'desc' }, limit: 100 },
    );
  }
}
