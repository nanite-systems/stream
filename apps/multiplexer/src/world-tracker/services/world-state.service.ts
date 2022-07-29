import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CensusClient } from 'ps2census';
import { WorldTracker } from '../trackers/world.tracker';
import { PublisherService } from '../../publisher/services/publisher.service';
import { CENSUS_CLIENTS } from '../../census/constants';

@Injectable()
export class WorldStateService implements OnModuleInit {
  constructor(
    @Inject(CENSUS_CLIENTS) private readonly censusClients: CensusClient[],
    private readonly worldTracker: WorldTracker,
    private readonly publishService: PublisherService,
  ) {}

  onModuleInit(): void {
    this.censusClients.forEach((client) =>
      client.on('serviceState', (worldId, state, detail) => {
        const worldState = {
          worldId,
          state,
          detail,
          environment: client.environment,
        };

        if (this.worldTracker.register(worldState))
          void this.publishService.publishWorldState(worldState);
      }),
    );
  }
}
