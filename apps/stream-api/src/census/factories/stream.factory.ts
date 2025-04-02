import { Injectable } from '@nestjs/common';
import { CensusClient, PS2Environment } from 'ps2census';
import { config } from '../../config';

@Injectable()
export class StreamFactory {
  createStream(environment: PS2Environment): CensusClient {
    return new CensusClient(config.ess.serviceId, environment);
  }
}
