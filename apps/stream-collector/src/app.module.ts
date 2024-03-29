import { Module, OnModuleDestroy } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from './config';
import { PublisherModule } from './publisher/publisher.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { envSplit, Logger, LoggerModule } from '@nss/utils';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: envSplit('ENV_PATHS', ['.env']),
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
