import { Inject, Logger, Module, OnApplicationShutdown } from '@nestjs/common';
import { ConfigModule } from '@nss/utils';
import { RabbitMqConfig } from './rabbit-mq.config';
import { RABBIT_MQ } from './constants';
import { AmqpConnectionManager, connect } from 'amqp-connection-manager';
import { TerminusModule } from '@nestjs/terminus';
import { RabbitMqIndicator } from './indicators';

@Module({
  imports: [ConfigModule.forFeature([RabbitMqConfig]), TerminusModule],
  providers: [
    RabbitMqIndicator,

    {
      provide: RABBIT_MQ,
      useFactory: (config: RabbitMqConfig) => connect([config.url]),
      inject: [RabbitMqConfig],
    },
  ],
  exports: [RABBIT_MQ, RabbitMqIndicator],
})
export class RabbitMqModule implements OnApplicationShutdown {
  private readonly logger = new Logger('RabbitMQ');

  constructor(
    @Inject(RABBIT_MQ) private readonly rabbit: AmqpConnectionManager,
  ) {
    rabbit
      .on('connect', () => {
        this.logger.log('Connected');
      })
      .on('disconnect', () => {
        this.logger.log('Disconnected');
      })
      .on('connectFailed', () => {
        this.logger.warn('Connection failed');
      });
  }

  async onApplicationShutdown(): Promise<void> {
    await this.rabbit.close();
  }
}
