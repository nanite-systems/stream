import { Module } from '@nestjs/common';
import { PublisherModule } from './publisher/publisher.module';

@Module({
  imports: [PublisherModule],
})
export class AppModule {}
