import { Module } from '@nestjs/common';
import { EventTrackerModule } from './event-tracker/event-tracker.module';
import { StateTrackerModule } from './state-tracker/state-tracker.module';

@Module({
  imports: [EventTrackerModule, StateTrackerModule],
})
export class AppModule {}
