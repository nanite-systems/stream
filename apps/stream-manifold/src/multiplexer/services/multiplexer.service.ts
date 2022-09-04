import { Inject, Injectable } from '@nestjs/common';
import { MULTIPLEXER_HTTP } from '../constants';
import { Axios } from 'axios';
import { WorldState } from '../../world-state/concerns/world-state.type';

@Injectable()
export class MultiplexerService {
  constructor(@Inject(MULTIPLEXER_HTTP) private readonly multiplexer: Axios) {}

  async getWorldsStates(): Promise<WorldState[]> {
    const { data } = await this.multiplexer.get('/world-states');

    return JSON.parse(data);
  }

  async getRecentCharactersIds(environment: string): Promise<string[]> {
    const { data } = await this.multiplexer.get('/recent-characters', {
      params: {
        environment,
      },
    });

    return JSON.parse(data);
  }

  async getRecentCharactersCount(environment: string): Promise<number> {
    const { data } = await this.multiplexer.get('/recent-characters/count', {
      params: {
        environment,
      },
    });

    return JSON.parse(data);
  }
}
