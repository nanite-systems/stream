import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { RabbitMqModule } from '../rabbit-mq/rabbit-mq.module';
import { MultiplexerModule } from '../multiplexer/multiplexer.module';

@Module({
  imports: [TerminusModule, RabbitMqModule, MultiplexerModule],
  controllers: [HealthController],
})
export class HealthModule {}
