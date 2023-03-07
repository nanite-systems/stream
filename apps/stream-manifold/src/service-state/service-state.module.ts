import { Module } from '@nestjs/common';
import { NssApiModule } from '../nss-api/nss-api.module';
import { ServiceStateService } from './services/service-state.service';

@Module({
  imports: [NssApiModule],
  providers: [ServiceStateService],
  exports: [ServiceStateService],
})
export class ServiceStateModule {}
