import { Module } from '@nestjs/common';
import { CensusModule } from '../census/census.module';
import { DbModule } from '../db/db.module';
import { ScheduleModule } from '@nestjs/schedule';
import { WorldStateService } from './services/world-state.service';
import { ServiceStateService } from './services/service-state.service';
import { WorldStateController } from './controllers/world-state.controller';
import { ServiceStateController } from './controllers/service-state.controller';

@Module({
  imports: [DbModule, CensusModule, ScheduleModule.forRoot()],
  providers: [WorldStateService, ServiceStateService],
  controllers: [WorldStateController, ServiceStateController],
})
export class StateTrackerModule {}
