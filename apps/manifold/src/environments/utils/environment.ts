import { filter, from, merge, Observable } from 'rxjs';
import { WorldState } from '../../world-state/concerns/world-state.type';
import { WorldStateService } from '../../world-state/services/world-state.service';
import { EnvironmentDescription } from './environment.description';

export class Environment {
  constructor(
    readonly environmentName: string,
    readonly description: EnvironmentDescription,
    private readonly worldStateService: WorldStateService,
  ) {}

  get worldStream(): Observable<WorldState> {
    return merge(
      from(this.getWorldStates()),
      this.worldStateService.stream.pipe(
        filter((state) => this.description.hasWorld(state.worldId)),
      ),
    );
  }

  get worlds(): string[] {
    return Array.from(this.description.worlds);
  }

  getWorldStates(): WorldState[] {
    return this.worldStateService
      .getStates()
      .filter(({ worldId }) => this.description.hasWorld(worldId));
  }
}
