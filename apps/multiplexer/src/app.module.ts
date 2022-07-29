import { Module } from '@nestjs/common';
import { IngressModule } from './ingress/ingress.module';
import { WorldTrackerModule } from './world-tracker/world-tracker.module';
import { RecentCharactersModule } from './recent-characters/recent-characters.module';

@Module({
  imports: [IngressModule, WorldTrackerModule, RecentCharactersModule],
})
export class AppModule {}
