import { Injectable, OnModuleInit } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { CensusClient } from 'ps2census';
import { ServiceState } from '../entities/service-state.entity';

@Injectable()
export class ServiceStateService implements OnModuleInit {
  constructor(
    private readonly census: CensusClient,
    private readonly entityManager: EntityManager,
  ) {}

  onModuleInit(): void {
    this.census.on('serviceState', (worldId, up) => {
      this.trackServiceState(worldId, up);
    });
  }

  trackServiceState(worldId: string, up: boolean): void {
    this.entityManager.transactional(async (em) => {
      const prev = await em.findOne(
        ServiceState,
        { worldId },
        { orderBy: { timestamp: 'desc' } },
      );

      if (!prev || prev.up != up)
        em.persist(
          new ServiceState({
            worldId,
            up,
            timestamp: new Date(new Date().toUTCString()),
          }),
        );
    });
  }
}
