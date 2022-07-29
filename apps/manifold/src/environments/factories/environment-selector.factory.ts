import { Injectable, Scope } from '@nestjs/common';
import { FactoryInterface } from '../../utils/factory.interface';
import { Environment } from '../utils/environment';
import { EnvironmentService } from '../services/environment.service';
import { EnvironmentAccessor } from '../utils/environment.accessor';

@Injectable({ scope: Scope.REQUEST })
export class EnvironmentSelectorFactory
  implements FactoryInterface<Environment | undefined>
{
  constructor(
    private readonly environmentService: EnvironmentService,
    private readonly environmentAccessor: EnvironmentAccessor,
  ) {}

  create(): Environment | undefined {
    return this.environmentService.get(this.environmentAccessor.environment);
  }
}
