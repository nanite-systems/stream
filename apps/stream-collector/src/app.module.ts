import { Module, OnModuleDestroy } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from './config';
import { PublisherModule } from './publisher/publisher.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { Logger, LoggerModule } from '@nss/utils';

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
    HealthModule,
    PublisherModule,
  ],
})
export class AppModule implements OnModuleDestroy {
  constructor(private readonly logger: Logger) {}

  onModuleDestroy(): void {
    this.logger.log('Goodbye :)', 'App');
  }
}
