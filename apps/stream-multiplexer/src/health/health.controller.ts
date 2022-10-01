import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { RabbitMqIndicator } from '../rabbit-mq/indicators/rabbit-mq.indicator';
import { CensusIndicator } from '../census/indicator/census.indicator';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly rabbit: RabbitMqIndicator,
    private readonly census: CensusIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.rabbit.check('rabbit'),
      () => this.census.check('census'),
    ]);
  }
}
