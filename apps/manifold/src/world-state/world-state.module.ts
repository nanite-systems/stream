import { Module } from '@nestjs/common';
import { MultiplexerModule } from '../multiplexer/multiplexer.module';
import { WorldStateService } from './services/world-state.service';

@Module({
  imports: [MultiplexerModule],
  providers: [WorldStateService],
  exports: [WorldStateService],
})
export class WorldStateModule {}
