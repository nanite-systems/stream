import { Module } from '@nestjs/common';
import { CensusModule } from '../census/census.module';
import { WorldStateController } from './controllers/world-state.controller';
import { WorldStateService } from './services/world-state.service';
import { PublisherModule } from '../publisher/publisher.module';
import { WorldTracker } from './trackers/world.tracker';

@Module({
  imports: [CensusModule, PublisherModule],
  providers: [WorldStateService, WorldTracker],
  controllers: [WorldStateController],
})
export class WorldTrackerModule {}
