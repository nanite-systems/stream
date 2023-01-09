import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { RabbitMqModule } from '@nss/rabbitmq';
import { CensusModule } from '../census/census.module';

@Module({
  imports: [TerminusModule, RabbitMqModule, CensusModule],
  controllers: [HealthController],
})
export class HealthModule {}
