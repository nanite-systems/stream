import { filter, from, merge, Observable } from 'rxjs';
import { ServiceStateService } from '../../service-state/services/service-state.service';
import { EnvironmentDescription } from './environment.description';
import { Environments, ServiceState } from '@nss/ess-concerns';

export class Environment {
  constructor(
    readonly name: Environments,
    readonly description: EnvironmentDescription,
    private readonly serviceStateService: ServiceStateService,
  ) {}

  get serviceStateStream(): Observable<ServiceState> {
    return merge(
      from(this.getServiceStates()),
      this.serviceStateService.stream.pipe(
        filter((state) => this.description.hasWorld(state.worldId)),
      ),
    );
  }

  get worlds(): string[] {
    return Array.from(this.description.worlds);
  }

  getServiceStates(): ServiceState[] {
    return this.serviceStateService
      .getStates()
      .filter(({ worldId }) => this.description.hasWorld(worldId));
  }
}
