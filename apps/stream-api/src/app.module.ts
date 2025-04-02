import { Module, OnModuleDestroy } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { RecentCharactersModule } from './recent-characters/recent-characters.module';
import { ServiceTrackerModule } from './service-tracker/service-tracker.module';
import { config } from './config';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { Logger, LoggerModule } from '@nss/utils';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      global: true,
      useFactory: () => ({
        level: config.log.level as any,
        pretty: config.log.pretty,
      }),
    }),
    PrometheusModule.register({ global: true }),
    CacheModule.register({ isGlobal: true }),
    RecentCharactersModule,
    ServiceTrackerModule,
    HealthModule,
  ],
})
export class AppModule implements OnModuleDestroy {
  constructor(private readonly logger: Logger) {}

  onModuleDestroy(): void {
    this.logger.log('Goodbye :)', 'App');
  }
}
