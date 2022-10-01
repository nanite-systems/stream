import { Module } from '@nestjs/common';
import { StreamModule } from './stream/stream.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [StreamModule, HealthModule],
})
export class AppModule {}
