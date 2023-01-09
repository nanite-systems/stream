import { Module } from '@nestjs/common';
import { NssService } from './services/nss.service';
import { NssServiceModule } from '@nss/rabbitmq';
import { NssCombinedClient } from './services/nss-combined.client';

@Module({
  imports: [NssServiceModule.forClient()],
  providers: [NssService, NssCombinedClient],
  exports: [NssService],
})
export class NssModule {}
