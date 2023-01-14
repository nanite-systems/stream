import { Module, OnModuleInit } from '@nestjs/common';
import { IngressModule } from '../ingress/ingress.module';
import { EnvironmentFactory } from './factories/environment.factory';
import { EnvironmentManifest } from './environment.manifest';
import { EnvironmentService } from './services/environment.service';
import { ServiceStateModule } from '../service-state/service-state.module';
import { provideFactory } from '../utils/provide.helpers';
import { Environment } from './utils/environment';
import { EnvironmentSelectorFactory } from './factories/environment-selector.factory';
import { EnvironmentAccessor } from './utils/environment.accessor';
import { EnvironmentName } from '../concerns/environment.type';
import { NssModule } from '../nss/nss.module';

@Module({
  imports: [IngressModule, NssModule, ServiceStateModule],
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
      this.service.register(
        this.factory.create(environment as EnvironmentName, description),
      );
  }
}
