import { Module, OnModuleDestroy } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { config } from './config';
import { PublisherModule } from './publisher/publisher.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { Logger, LoggerModule } from '@nss/utils';

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
