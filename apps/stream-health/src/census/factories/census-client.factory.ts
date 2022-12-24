import { Injectable } from '@nestjs/common';
import { CensusConfig } from '../census.config';
import { CensusClient } from 'ps2census';

@Injectable()
export class CensusClientFactory {
  constructor(private readonly config: CensusConfig) {}

  create(): CensusClient {
    return new CensusClient(this.config.serviceId, 'all' as any, {
      streamManager: {
        endpoint: this.config.connectionURL,
        subscription: {
          eventNames: ['all'],
          worlds: ['all'],
          characters: ['all'],
        },
      },
    });
  }
}
