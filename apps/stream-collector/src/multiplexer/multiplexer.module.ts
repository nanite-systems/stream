import { Module } from '@nestjs/common';
import { PublisherModule } from '../publisher/publisher.module';
import { DuplicateFilter } from './pipes/duplicate.filter';
import { MultiplexStreamFilter } from './pipes/multiplex-stream.filter';
import { MultiplexerService } from './services/multiplexer.service';

@Module({
  imports: [PublisherModule],
  providers: [DuplicateFilter, MultiplexStreamFilter, MultiplexerService],
  exports: [MultiplexerService],
})
export class MultiplexerModule {}
