import { Injectable } from '@nestjs/common';
import { EnvironmentDescription } from '../utils/environment.description';
import { Environment } from '../utils/environment';
import { ServiceStateService } from '../../service-state/services/service-state.service';
import { EnvironmentName } from '../../concerns/environment.type';
import { NssServiceContainer } from '../../nss/services/nss-service.container';

@Injectable()
export class EnvironmentFactory {
  constructor(
    private readonly serviceStateService: ServiceStateService,
    private readonly nssContainer: NssServiceContainer,
  ) {}

  create(
    name: EnvironmentName,
    description: EnvironmentDescription,
  ): Environment {
    return new Environment(
      name,
      description,
      this.serviceStateService,
      this.nssContainer.getService(name),
    );
  }
}
