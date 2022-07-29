import { Injectable } from '@nestjs/common';
import { CensusClient, PS2Environment } from 'ps2census';
import { CensusConfig } from '../census.config';

@Injectable()
export class CensusClientFactory {
  constructor(private readonly config: CensusConfig) {}

  create(environment: PS2Environment): CensusClient {
    return new CensusClient(this.config.serviceId, environment);
  }
}
