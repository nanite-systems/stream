import { Injectable } from '@nestjs/common';
import { Stream } from 'ps2census';
import { PublisherService } from '../../publisher/services/publisher.service';
import { ServiceState } from '@nss/rabbitmq';

@Injectable()
export class ServiceTrackerService {
  private readonly cache = new Map<string, ServiceState>();

  constructor(private readonly publisher: PublisherService) {}

  handleState(change: Stream.CensusMessages.ServiceStateChanged): void {
    const worldId = /\d+/.exec(change.detail)[0];
    const worldName = /(?<=_)[a-z]+/i.exec(change.detail)[0];
    const online = change.online == 'true';
    const prevState = this.cache.get(worldId);

    if (prevState && prevState.online == online) return;

    const state = {
      worldId,
      worldName,
      timestamp: new Date().getTime(),
      online,
    } satisfies ServiceState;

    this.cache.set(worldId, state);
    void this.publisher.publishServiceState(state);
  }

  getStates(): ServiceState[] {
    return Array.from(this.cache.values());
  }
}
