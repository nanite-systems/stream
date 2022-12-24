import { Inject, Logger, Module, OnApplicationShutdown } from '@nestjs/common';
import { ConfigModule } from '@nanite-systems/utils';
import { RabbitMqConfig } from './rabbit-mq.config';
import { INGRESS_QUEUE, RABBIT_MQ } from './constants';
import { connect } from 'amqp-connection-manager';
import { DataStreamFactory } from './factories/data-stream.factory';
import { IAmqpConnectionManager } from 'amqp-connection-manager/dist/esm/AmqpConnectionManager';
import { RabbitMqIndicator } from './indicators/rabbit-mq.indicator';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [ConfigModule.forFeature([RabbitMqConfig]), TerminusModule],
  providers: [
    DataStreamFactory,
    RabbitMqIndicator,

    {
      provide: RABBIT_MQ,
      useFactory: (config: RabbitMqConfig) => connect([config.url]),
      inject: [RabbitMqConfig],
    },
    {
      provide: INGRESS_QUEUE,
      useFactory: (factory: DataStreamFactory, config: RabbitMqConfig) =>
        factory.create(config.streamExchange),
      inject: [DataStreamFactory, RabbitMqConfig],
    },
  ],
  exports: [INGRESS_QUEUE, RabbitMqIndicator],
})
export class RabbitMqModule implements OnApplicationShutdown {
  private readonly logger = new Logger('RabbitMQ');

  constructor(
    @Inject(RABBIT_MQ) private readonly rabbitmq: IAmqpConnectionManager,
  ) {
    rabbitmq
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
    await this.rabbitmq.close();
  }
}
