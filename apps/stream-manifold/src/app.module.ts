import { Logger, Module, OnModuleDestroy } from '@nestjs/common';
import { StreamModule } from './stream/stream.module';
import { HealthModule } from './health/health.module';
import { ConfigModule } from '@nestjs/config';
import { config } from './config';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 30,
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
