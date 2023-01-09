import { Module } from '@nestjs/common';
import { NssService } from './services/nss.service';
import { NssServiceModule as NssBaseModule } from '@nss/rabbitmq';

@Module({
  imports: [NssBaseModule.forClient()],
  providers: [NssService],
  exports: [NssService],
})
export class NssModule {}
