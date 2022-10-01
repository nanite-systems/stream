import { Module } from '@nestjs/common';
import { IngressModule } from './ingress/ingress.module';
import { WorldTrackerModule } from './world-tracker/world-tracker.module';
import { RecentCharactersModule } from './recent-characters/recent-characters.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    IngressModule,
    WorldTrackerModule,
    RecentCharactersModule,
    HealthModule,
  ],
})
export class AppModule {}
