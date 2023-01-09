import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { Injectable } from '@nestjs/common';
import { StreamConductorService } from '../services/stream-conductor.service';

@Injectable()
export class StreamIndicator extends HealthIndicator {
  constructor(private readonly conductor: StreamConductorService) {
    super();
  }

  check(key: string): HealthIndicatorResult {
    const status = this.conductor.getStatus();
    const isHealthy = status.cycling < status.connections;

    const result = this.getStatus(key, isHealthy, status);

    if (isHealthy) return result;

    throw new HealthCheckError('Stream check failed', result);
  }
}
