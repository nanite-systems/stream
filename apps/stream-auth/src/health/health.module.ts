import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { RedisModule } from '../redis/redis.module';
import { HealthController } from './health.controller';

@Module({
  imports: [TerminusModule.forRoot({ logger: false }), RedisModule],
  controllers: [HealthController],
})
export class HealthModule {}
