import { Logger, Module, OnModuleDestroy } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { ConfigModule } from '@nestjs/config';
import { config } from './config';
import { PublisherModule } from './publisher/publisher.module';
import { MetricModule } from './metrics/metric.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    MetricModule,
    HealthModule,
    PublisherModule,
  ],
})
export class AppModule implements OnModuleDestroy {
  onModuleDestroy(): void {
    new Logger('App').log('Goodbye :)');
  }
}
