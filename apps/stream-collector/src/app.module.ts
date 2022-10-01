import { Module } from '@nestjs/common';
import { PublisherModule } from './publisher/publisher.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [PublisherModule, HealthModule],
})
export class AppModule {}
