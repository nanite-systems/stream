import { Controller, Get, Inject, Query } from '@nestjs/common';
import {
  PC_CLIENT,
  PS4_EU_CLIENT,
  PS4_US_CLIENT,
} from '../../census/constants';
import { CensusClient } from 'ps2census';
import { FetchRecentCharactersDto } from '../dtos/fetch-recent-characters.dto';

@Controller('/recent-characters')
export class RecentCharactersController {
  constructor(
    @Inject(PC_CLIENT) private readonly censusClientPc: CensusClient,
    @Inject(PS4_EU_CLIENT) private readonly censusClientPs4Eu: CensusClient,
    @Inject(PS4_US_CLIENT) private readonly censusClientPs4Us: CensusClient,
  ) {}

  @Get()
  recentCharacters(
    @Query() params: FetchRecentCharactersDto,
  ): Promise<string[]> {
    switch (params.environment) {
      case 'ps2':
        return this.censusClientPc.recentCharacters();
      case 'ps2ps4eu':
        return this.censusClientPs4Eu.recentCharacters();
      case 'ps2ps4us':
        return this.censusClientPs4Us.recentCharacters();
    }
  }

  @Get('/count')
  recentCharacterCount(
    @Query() params: FetchRecentCharactersDto,
  ): Promise<number> {
    switch (params.environment) {
      case 'ps2':
        return this.censusClientPc.recentCharacterCount();
      case 'ps2ps4eu':
        return this.censusClientPs4Eu.recentCharacterCount();
      case 'ps2ps4us':
        return this.censusClientPs4Us.recentCharacterCount();
    }
  }
}
