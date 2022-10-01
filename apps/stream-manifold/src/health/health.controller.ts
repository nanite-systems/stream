import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { MultiplexerIndicator } from '../multiplexer/indicators/multiplexer.indicator';
import { RabbitMqIndicator } from '../rabbit-mq/indicators/rabbit-mq.indicator';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly multiplexer: MultiplexerIndicator,
    private readonly rabbit: RabbitMqIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.multiplexer.check('multiplexer'),
      () => this.rabbit.check('rabbit'),
    ]);
  }
}
