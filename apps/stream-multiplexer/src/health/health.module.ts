import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { RabbitMqModule } from '../rabbit-mq/rabbit-mq.module';
import { HealthController } from './health.controller';
import { CensusModule } from '../census/census.module';

@Module({
  imports: [TerminusModule, RabbitMqModule, CensusModule],
  controllers: [HealthController],
})
export class HealthModule {}
