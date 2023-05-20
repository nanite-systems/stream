import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { CensusModule } from '../census/census.module';

@Module({
  imports: [TerminusModule.forRoot({ logger: false }), CensusModule],
  controllers: [HealthController],
})
export class HealthModule {}
