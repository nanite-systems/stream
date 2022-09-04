import { Module, OnModuleInit } from '@nestjs/common';
import { IngressModule } from '../ingress/ingress.module';
import { EnvironmentFactory } from './factories/environment.factory';
import { EnvironmentManifest } from './environment.manifest';
import { EnvironmentService } from './services/environment.service';
import { WorldStateModule } from '../world-state/world-state.module';
import { provideFactory } from '../utils/provide.helpers';
import { Environment } from './utils/environment';
import { EnvironmentSelectorFactory } from './factories/environment-selector.factory';
import { EnvironmentAccessor } from './utils/environment.accessor';

@Module({
  imports: [IngressModule, WorldStateModule],
  providers: [
    EnvironmentFactory,
    EnvironmentService,
    EnvironmentSelectorFactory,
    EnvironmentAccessor,

    provideFactory(Environment, EnvironmentSelectorFactory),
  ],
  exports: [EnvironmentService, Environment],
})
export class EnvironmentsModule implements OnModuleInit {
  constructor(
    private readonly factory: EnvironmentFactory,
    private readonly service: EnvironmentService,
  ) {}

  onModuleInit(): void {
    for (const [environment, description] of Object.entries(
      EnvironmentManifest.environments,
    ))
      this.service.register(this.factory.create(environment, description));
  }
}
