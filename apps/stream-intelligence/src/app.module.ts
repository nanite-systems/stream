import { Logger, Module, OnModuleDestroy } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { CollectorModule } from './collector/collector.module';
import { RecentCharactersModule } from './recent-characters/recent-characters.module';
import { ServiceTrackerModule } from './service-tracker/service-tracker.module';
import { ConfigModule } from '@nestjs/config';
import { config } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    CollectorModule,
    RecentCharactersModule,
    ServiceTrackerModule,
    HealthModule,
  ],
})
export class AppModule implements OnModuleDestroy {
  onModuleDestroy(): void {
    new Logger('App').log('Goodbye :)');
  }
}
