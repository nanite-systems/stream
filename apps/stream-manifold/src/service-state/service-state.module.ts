import { Module } from '@nestjs/common';
import { NssModule } from '../nss/nss.module';
import { ServiceStateService } from './services/service-state.service';

@Module({
  imports: [NssModule],
  providers: [ServiceStateService],
  exports: [ServiceStateService],
})
export class ServiceStateModule {}
