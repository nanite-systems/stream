import { Module, OnModuleDestroy } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { RecentCharactersModule } from './recent-characters/recent-characters.module';
import { ServiceTrackerModule } from './service-tracker/service-tracker.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from './config';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { Logger, LoggerModule } from '@nss/utils';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [config],
    }),
    LoggerModule.forRootAsync({
      global: true,
      useFactory: (config: ConfigService) => ({
        level: config.get('log.level'),
        pretty: config.get('log.pretty'),
      }),
      inject: [ConfigService],
    }),
    PrometheusModule.register(),
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
