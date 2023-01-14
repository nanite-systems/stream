import { Module } from '@nestjs/common';
import { NssServiceModule } from '@nss/rabbitmq';
import { NssCombinedClient } from './services/nss-combined.client';
import { NssServiceContainer } from './services/nss-service.container';

@Module({
  imports: [NssServiceModule.forClient()],
  providers: [NssServiceContainer, NssCombinedClient],
  exports: [NssServiceContainer],
})
export class NssModule {}
