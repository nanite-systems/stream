import { Injectable } from '@nestjs/common';
import { CensusConfig } from '../census.config';
import { PS2Environment } from 'ps2census';
import { RestClient } from 'ps2census/dist/rest/rest.client';

@Injectable()
export class RestClientFactory {
  constructor(private readonly config: CensusConfig) {}

  create(environment: PS2Environment): RestClient {
    return new RestClient(environment, { serviceId: this.config.serviceId });
  }
}
