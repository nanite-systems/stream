import { Module } from '@nestjs/common';
import { CensusModule } from '../census/census.module';
import { RecentCharacterService } from './services/recent-character.service';
import { RecentCharactersController } from './controllers/recent-characters.controller';

@Module({
  imports: [CensusModule],
  providers: [RecentCharacterService],
  controllers: [RecentCharactersController],
})
export class RecentCharactersModule {}
