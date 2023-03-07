import { Inject, Injectable } from '@nestjs/common';
import { CensusClient } from 'ps2census';
import { ServiceState } from '@nss/ess-concerns';
import { STREAM_PC, STREAM_PS4EU, STREAM_PS4US } from '../../census/constants';

@Injectable()
export class ServiceTrackerService {
  private readonly cache = new Map<string, ServiceState>();

  constructor(
    @Inject(STREAM_PC) private readonly pc: CensusClient,
    @Inject(STREAM_PS4EU) private readonly ps4eu: CensusClient,
    @Inject(STREAM_PS4US) private readonly ps4us: CensusClient,
  ) {
    for (const stream of [pc, ps4eu, ps4us])
      stream.on('serviceState', (world, online, details) => {
        this.registerState(world, online, details);
      });
  }

  registerState(worldId: string, online: boolean, detail: string): void {
    const worldName = /(?<=_)[a-z]+/i.exec(detail)[0];
    const prevState = this.cache.get(worldId);

    if (prevState && prevState.online == online) return;

    const state: ServiceState = {
      worldId,
      worldName,
      detail,
      online,
    };

    this.cache.set(worldId, state);
  }

  getStates(): ServiceState[] {
    return Array.from(this.cache.values());
  }
}
