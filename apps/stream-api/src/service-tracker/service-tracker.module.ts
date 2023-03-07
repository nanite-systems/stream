import { Module } from '@nestjs/common';
import { ServiceTrackerService } from './services/service-tracker.service';
import { ServiceStateController } from './controllers/service-state.controller';

@Module({
  providers: [ServiceTrackerService],
  controllers: [ServiceStateController],
  exports: [ServiceTrackerService],
})
export class ServiceTrackerModule {}
