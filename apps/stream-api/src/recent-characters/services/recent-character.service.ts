import { Inject, Injectable } from '@nestjs/common';
import { CensusClient } from 'ps2census';
import { STREAM_PC, STREAM_PS4EU, STREAM_PS4US } from '../../census/constants';
import {
  Environments,
  RecentCharacterCountResponse,
  RecentCharactersResponse,
} from '@nss/ess-concerns';

@Injectable()
export class RecentCharacterService {
  constructor(
    @Inject(STREAM_PC) private readonly pc: CensusClient,
    @Inject(STREAM_PS4EU) private readonly ps4eu: CensusClient,
    @Inject(STREAM_PS4US) private readonly ps4us: CensusClient,
  ) {}

  async recentCharacters(
    environment: Environments,
  ): Promise<RecentCharactersResponse> {
    switch (environment) {
      case Environments.PC:
        return this.pc.recentCharacters();
      case Environments.PS4EU:
        return this.ps4eu.recentCharacters();
      case Environments.PS4US:
        return this.ps4us.recentCharacters();
      case Environments.ALL:
        return Promise.all(this.streams.map((s) => s.recentCharacters())).then(
          (r) => r.flat(),
        );
    }
  }

  async recentCharacterCount(
    environment: Environments,
  ): Promise<RecentCharacterCountResponse> {
    switch (environment) {
      case Environments.PC:
        return this.pc.recentCharacterCount();
      case Environments.PS4EU:
        return this.ps4eu.recentCharacterCount();
      case Environments.PS4US:
        return this.ps4us.recentCharacterCount();
      case Environments.ALL:
        return Promise.all(
          this.streams.map((s) => s.recentCharacterCount()),
        ).then((r) => r.reduce((a, b) => a + b));
    }
  }

  private get streams(): CensusClient[] {
    return [this.pc, this.ps4eu, this.ps4us];
  }
}
