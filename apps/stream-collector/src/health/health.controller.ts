import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
} from '@nestjs/terminus';
import { RabbitMqIndicator } from '@nss/rabbitmq';
import { StreamIndicator } from '../census/indicators/stream.indicator';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly rabbit: RabbitMqIndicator,
    private readonly census: StreamIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.rabbit.check('rabbit'),
      () => this.census.check('census'),
    ]);
  }
}
