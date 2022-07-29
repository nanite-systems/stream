import { Module } from '@nestjs/common';
import { StreamModule } from './stream/stream.module';

@Module({
  imports: [StreamModule],
})
export class AppModule {}
