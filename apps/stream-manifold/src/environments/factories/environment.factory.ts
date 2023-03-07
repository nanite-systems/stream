import { Injectable } from '@nestjs/common';
import { EnvironmentDescription } from '../utils/environment.description';
import { Environment } from '../utils/environment';
import { ServiceStateService } from '../../service-state/services/service-state.service';
import { EnvironmentName } from '../../concerns/environment.type';

@Injectable()
export class EnvironmentFactory {
  constructor(private readonly serviceStateService: ServiceStateService) {}

  create(
    name: EnvironmentName,
    description: EnvironmentDescription,
  ): Environment {
    return new Environment(name, description, this.serviceStateService);
  }
}
