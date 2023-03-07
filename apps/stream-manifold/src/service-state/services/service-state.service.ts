import { Injectable, OnModuleInit } from '@nestjs/common';
import { mergeMap, Observable, of, Subject } from 'rxjs';
import { ServiceState } from '@nss/ess-concerns';
import { NssApiService } from '../../nss-api/services/nss-api.service';

@Injectable()
export class ServiceStateService implements OnModuleInit {
  private readonly cache = new Map<string, ServiceState>();

  private readonly _stream = new Subject<ServiceState>();

  constructor(private readonly api: NssApiService) {}

  get stream(): Observable<ServiceState> {
    return this._stream;
  }

  onModuleInit(): void {
    this.fetchStates();
  }

  getStates(): ServiceState[] {
    return Array.from(this.cache.values());
  }

  registerState(state: ServiceState): void {
    const current = this.cache.get(state.worldId);

    this.cache.set(state.worldId, state);

    if (!current || current.online != state.online) this._stream.next(state);
  }

  fetchStates(): void {
    this.api
      .serviceStates('all')
      .pipe(mergeMap((res) => of(...res)))
      .subscribe((state) => {
        this.registerState(state);
      });
  }
}
