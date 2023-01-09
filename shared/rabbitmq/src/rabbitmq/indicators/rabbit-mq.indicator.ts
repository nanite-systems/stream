import { MicroserviceHealthIndicator } from '@nestjs/terminus';
import { Transport } from '@nestjs/microservices';
import { RabbitMqConfig } from '../rabbit-mq.config';
import { Injectable } from '@nestjs/common';
import { HealthIndicatorResult } from '@nestjs/terminus/dist/health-indicator';

@Injectable()
export class RabbitMqIndicator {
  constructor(
    private readonly microservice: MicroserviceHealthIndicator,
    private readonly config: RabbitMqConfig,
  ) {}

  check(key: string): Promise<HealthIndicatorResult> {
    return this.microservice.pingCheck(key, {
      transport: Transport.RMQ,
      options: { urls: [this.config.url] },
    });
  }
}
