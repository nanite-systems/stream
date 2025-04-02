import { Logger, Module, OnModuleDestroy } from '@nestjs/common';
import { StreamModule } from './stream/stream.module';
import { HealthModule } from './health/health.module';
import { config } from './config';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { RabbitMqModule } from '@nss/rabbitmq';
import { LoggerModule } from '@nss/utils';

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
    RabbitMqModule.forRootAsync({
      global: true,
      useFactory: () => ({
        urls: config.rabbitmq.urls,
      }),
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
