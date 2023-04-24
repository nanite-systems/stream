import { Injectable, OnModuleInit } from '@nestjs/common';
import { firstValueFrom, Observable, retry, Subject, timeout } from 'rxjs';
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

  async onModuleInit(): Promise<void> {
    const states = await firstValueFrom(
      this.api.serviceStates().pipe(timeout(5000), retry(10)),
    );

    for (const state of states) this.registerState(state);
  }

  getStates(): ServiceState[] {
    return Array.from(this.cache.values());
  }

  registerState(state: ServiceState): void {
    const current = this.cache.get(state.worldId);

    this.cache.set(state.worldId, state);

    if (!current || current.online != state.online) this._stream.next(state);
  }
}
