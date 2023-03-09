import { Logger, Module, OnModuleDestroy } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { ConfigModule } from '@nestjs/config';
import { config } from './config';
import { PublisherModule } from './publisher/publisher.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    PrometheusModule.register(),
    HealthModule,
    PublisherModule,
  ],
})
export class AppModule implements OnModuleDestroy {
  onModuleDestroy(): void {
    new Logger('App').log('Goodbye :)');
  }
}
