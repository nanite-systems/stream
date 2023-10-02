import { Injectable } from '@nestjs/common';
import { CensusClient, PS2Environment } from 'ps2census';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StreamFactory {
  constructor(private readonly config: ConfigService) {}

  createStream(environment: PS2Environment): CensusClient {
    return new CensusClient(
      this.config.getOrThrow('ess.serviceId'),
      environment,
    );
  }
}
