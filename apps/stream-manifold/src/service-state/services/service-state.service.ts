import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { sleep } from '../../utils/promise.helper';
import { NssService } from '../../nss/services/nss.service';
import { ServiceState } from '@nss/rabbitmq';

@Injectable()
export class ServiceStateService implements OnModuleInit {
  private readonly logger = new Logger('ServiceStateService');

  private readonly cache = new Map<string, ServiceState>();

  private readonly _stream = new Subject<ServiceState>();

  constructor(private readonly nss: NssService) {}

  get stream(): Observable<ServiceState> {
    return this._stream;
  }

  async onModuleInit(): Promise<void> {
    do {
      try {
        await this.fetchStates();
        return;
      } catch (err) {
        this.logger.error(`Failed to initialize world states: ${err}`);

        // Let's not try to DDOS anything
        await sleep(1000);
      }
    } while (true);
  }

  getStates(): ServiceState[] {
    return Array.from(this.cache.values());
  }

  registerState(state: ServiceState): void {
    const current = this.cache.get(state.worldId);

    this.cache.set(state.worldId, state);

    if (!current || current.online != state.online) this._stream.next(state);
  }

  async fetchStates(): Promise<void> {
    const states = await this.nss.getServiceStates('all');

    states.forEach((state) => this.registerState(state));
  }
}
