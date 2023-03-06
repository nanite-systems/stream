import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { Inject, Injectable } from '@nestjs/common';
import { MANAGED_CONNECTIONS } from '../constants';
import { ManagedConnection } from '../utils/managed-connection';

@Injectable()
export class StreamIndicator extends HealthIndicator {
  constructor(
    @Inject(MANAGED_CONNECTIONS)
    private readonly connections: ManagedConnection[],
  ) {
    super();
  }

  check(key: string): HealthIndicatorResult {
    const connections = this.connections.map((c) => c.status());
    const isHealthy = connections.some((c) => c.accepted);

    const result = this.getStatus(key, isHealthy, { connections });

    if (isHealthy) return result;

    throw new HealthCheckError('Stream check failed', result);
  }
}
