import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { RabbitMqModule } from '@nss/rabbitmq';

@Module({
  imports: [TerminusModule, RabbitMqModule],
  controllers: [HealthController],
})
export class HealthModule {}
