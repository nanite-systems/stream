import { Module } from '@nestjs/common';
import { MultiplexerService } from './services/multiplexer.service';
import { EventEntityFactory } from './factories/event-entity.factory';
import { CensusModule } from '../census/census.module';

@Module({
  imports: [CensusModule],
  providers: [EventEntityFactory, MultiplexerService],
  exports: [MultiplexerService],
})
export class MultiplexerModule {}
