import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  MicroserviceHealthIndicator,
  MicroserviceHealthIndicatorOptions,
} from '@nestjs/terminus';
import { StreamIndicator } from '../census/indicators/stream.indicator';
import { RmqOptions, Transport } from '@nestjs/microservices';
import { config } from '../config';

@Controller('health')
export class HealthController {
  private readonly rabbitmq: MicroserviceHealthIndicatorOptions;

  constructor(
    private readonly health: HealthCheckService,
    private readonly microservice: MicroserviceHealthIndicator,
    private readonly census: StreamIndicator,
  ) {
    this.rabbitmq = {
      transport: Transport.RMQ,
      options: {
        urls: config.rabbitmq.urls,
      },
    } satisfies RmqOptions;
  }

  @Get()
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.microservice.pingCheck('rmq', this.rabbitmq),
      () => this.census.check('ess'),
    ]);
  }
}
