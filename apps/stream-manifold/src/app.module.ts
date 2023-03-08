import { Logger, Module, OnModuleDestroy } from '@nestjs/common';
import { StreamModule } from './stream/stream.module';
import { HealthModule } from './health/health.module';
import { ConfigModule } from '@nestjs/config';
import { config } from './config';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    PrometheusModule.register(),
    StreamModule,
    HealthModule,
  ],
})
export class AppModule implements OnModuleDestroy {
  onModuleDestroy(): void {
    new Logger('App').log('Goodbye :)');
  }
}
