import { Module } from '@nestjs/common';
import { CensusModule } from '../census/census.module';
import { RecentCharactersController } from './controllers/recent-characters.controller';

@Module({
  imports: [CensusModule],
  controllers: [RecentCharactersController],
})
export class RecentCharactersModule {}
