import { Logger, Module, OnModuleDestroy } from '@nestjs/common';
import { StreamModule } from './stream/stream.module';
import { HealthModule } from './health/health.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from './config';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { RabbitMqModule } from '@nss/rabbitmq';
import { envSplit, LoggerModule } from '@nss/utils';

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
    RabbitMqModule.forRootAsync({
      global: true,
      useFactory: (config: ConfigService) => ({
        urls: config.get('rabbitmq.urls'),
      }),
      inject: [ConfigService],
    }),
    StreamModule,
    HealthModule,
  ],
})
export class AppModule implements OnModuleDestroy {
  onModuleDestroy(): void {
    new Logger('App').log('Goodbye :)');
  }
}
