import { Module } from '@nestjs/common';
import { PublisherModule } from '../publisher/publisher.module';
import { ServiceTrackerService } from './services/service-tracker.service';
import { ServiceStateController } from './controllers/service-state.controller';

@Module({
  imports: [PublisherModule],
  providers: [ServiceTrackerService],
  controllers: [ServiceStateController],
  exports: [ServiceTrackerService],
})
export class ServiceTrackerModule {}
