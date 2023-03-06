import { Logger, Module, OnModuleDestroy } from '@nestjs/common';
import { StreamModule } from './stream/stream.module';
import { HealthModule } from './health/health.module';
import { ConfigModule } from '@nestjs/config';
import { config } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    StreamModule,
    HealthModule,
  ],
})
export class AppModule implements OnModuleDestroy {
  onModuleDestroy(): void {
    new Logger('App').log('Goodbye :)');
  }
}
