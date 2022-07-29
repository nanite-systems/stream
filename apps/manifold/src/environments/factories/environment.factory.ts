import { Injectable } from '@nestjs/common';
import { EnvironmentDescription } from '../utils/environment.description';
import { Environment } from '../utils/environment';
import { WorldStateService } from '../../world-state/services/world-state.service';

@Injectable()
export class EnvironmentFactory {
  constructor(private readonly worldStateService: WorldStateService) {}

  create(
    environmentName: string,
    description: EnvironmentDescription,
  ): Environment {
    return new Environment(
      environmentName,
      description,
      this.worldStateService,
    );
  }
}
