import { Module } from '@nestjs/common';
import { ServiceTrackerService } from './services/service-tracker.service';
import { ServiceStateController } from './controllers/service-state.controller';
import { CensusModule } from '../census/census.module';

@Module({
  imports: [CensusModule],
  providers: [ServiceTrackerService],
  controllers: [ServiceStateController],
  exports: [ServiceTrackerService],
})
export class ServiceTrackerModule {}
