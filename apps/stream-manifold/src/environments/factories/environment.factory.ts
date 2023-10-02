import { Injectable } from '@nestjs/common';
import { EnvironmentDescription } from '../utils/environment.description';
import { Environment } from '../utils/environment';
import { ServiceStateService } from '../../service-state/services/service-state.service';
import { Environments } from '@nss/ess-concerns';

@Injectable()
export class EnvironmentFactory {
  constructor(private readonly serviceStateService: ServiceStateService) {}

  create(name: Environments, description: EnvironmentDescription): Environment {
    return new Environment(name, description, this.serviceStateService);
  }
}
