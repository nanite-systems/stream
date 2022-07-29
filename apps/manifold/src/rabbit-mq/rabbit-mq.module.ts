import { Inject, Logger, Module, OnApplicationShutdown } from '@nestjs/common';
import { ConfigModule } from '@census-reworked/nestjs-utils';
import { RabbitMqConfig } from './rabbit-mq.config';
import { INGRESS_QUEUE, RABBIT_MQ } from './constants';
import { connect } from 'amqp-connection-manager';
import { DataStreamFactory } from './factories/data-stream.factory';
import { IAmqpConnectionManager } from 'amqp-connection-manager/dist/esm/AmqpConnectionManager';

@Module({
  imports: [ConfigModule.forFeature([RabbitMqConfig])],
  providers: [
    DataStreamFactory,

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
  exports: [INGRESS_QUEUE],
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
