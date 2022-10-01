import { Injectable } from '@nestjs/common';
import { CensusConfig } from '../census.config';
import { CensusClient } from 'ps2census';
import { HealthCheckError, HealthIndicator } from '@nestjs/terminus';

@Injectable()
export class CensusIndicator extends HealthIndicator {
  constructor(private readonly config: CensusConfig) {
    super();
  }

  async check(key: string) {
    const client = new CensusClient(this.config.serviceId, 'ps2');

    try {
      await client.watch();

      return this.getStatus(key, true);
    } catch (err) {
      throw new HealthCheckError(key, { message: err.toString() });
    } finally {
      try {
        client.destroy();
      } catch {}
    }
  }
}
