import { Inject, Injectable } from '@nestjs/common';
import { DETAILED_CONNECTIONS } from '../../census/constants';
import { ServiceState } from '@nss/ess-concerns';
import { filter, from, mergeMap, Observable, share, tap } from 'rxjs';
import { DetailedConnectionContract } from '../../census/concerns/detailed-connection.contract';

@Injectable()
export class ServiceTrackerService {
  private readonly cache = new Map<string, ServiceState>();

  private readonly observable: Observable<ServiceState>;

  constructor(
    @Inject(DETAILED_CONNECTIONS)
    private readonly connections: DetailedConnectionContract[],
  ) {
    this.observable = from(connections).pipe(
      mergeMap(({ connection }) => connection.observeServiceState()),
      filter((state) => {
        const prev = this.cache.get(state.worldId);
        return !prev || prev.online != state.online;
      }),
      tap((state) => this.cache.set(state.worldId, state)),
      share(),
    );
  }

  observeServiceState(): Observable<ServiceState> {
    return this.observable;
  }
}
