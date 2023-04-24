import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  MicroserviceHealthIndicator,
  MicroserviceHealthIndicatorOptions,
} from '@nestjs/terminus';
import { RmqOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Controller('health')
export class HealthController {
  private readonly rabbitmq: MicroserviceHealthIndicatorOptions;

  constructor(
    private readonly health: HealthCheckService,
    private readonly microservice: MicroserviceHealthIndicator,
    config: ConfigService,
  ) {
    this.rabbitmq = {
      transport: Transport.RMQ,
      options: {
        urls: config.get('rabbitmq.urls'),
      },
    } satisfies RmqOptions;
  }

  @Get()
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.microservice.pingCheck('rmq', this.rabbitmq),
    ]);
  }
}
