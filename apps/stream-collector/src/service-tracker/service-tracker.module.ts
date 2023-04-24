import { Module } from '@nestjs/common';
import { CensusModule } from '../census/census.module';
import { ServiceTrackerService } from './services/service-tracker.service';

@Module({
  imports: [CensusModule],
  providers: [ServiceTrackerService],
  exports: [ServiceTrackerService],
})
export class ServiceTrackerModule {}
