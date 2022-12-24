import { Controller, Get, Param, Scope } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { ServiceState } from '../entities/service-state.entity';

@Controller({ path: 'services', scope: Scope.REQUEST })
export class ServiceStateController {
  constructor(private readonly entityManager: EntityManager) {}

  @Get()
  state() {
    return this.entityManager
      .createQueryBuilder(ServiceState)
      .distinctOn('world_id')
      .orderBy({ worldId: 'asc', timestamp: 'desc' })
      .getResult();
  }

  @Get(':world')
  history(@Param('world') worldId: string) {
    return this.entityManager.find(
      ServiceState,
      { worldId },
      { orderBy: { timestamp: 'desc' }, limit: 100 },
    );
  }
}
