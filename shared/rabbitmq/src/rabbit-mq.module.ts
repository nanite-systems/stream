import {
  DynamicModule,
  Inject,
  Logger,
  Module,
  ModuleMetadata,
  OnApplicationShutdown,
} from '@nestjs/common';
import { RABBIT_MQ, RABBIT_MQ_OPTIONS } from './constants';
import {
  AmqpConnectionManager,
  AmqpConnectionManagerOptions,
  connect,
  ConnectionUrl,
} from 'amqp-connection-manager';
import { TerminusModule } from '@nestjs/terminus';

export interface RabbitMqModuleOptions extends AmqpConnectionManagerOptions {
  urls: ConnectionUrl | ConnectionUrl[];
}

export interface RabbitMqModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports' | 'providers'> {
  useFactory: (
    ...args: any[]
  ) => Promise<RabbitMqModuleOptions> | RabbitMqModuleOptions;
  inject?: any[];
}

@Module({})
export class RabbitMqModule implements OnApplicationShutdown {
  static forRootAsync(options: RabbitMqModuleAsyncOptions): DynamicModule {
    return {
      module: RabbitMqModule,
      imports: [TerminusModule, ...(options.imports ?? [])],
      providers: [
        {
          provide: RABBIT_MQ_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject,
        },
        {
          provide: RABBIT_MQ,
          useFactory: (options: RabbitMqModuleOptions) =>
            connect(options.urls, options),
          inject: [RABBIT_MQ_OPTIONS],
        },
      ],
      exports: [RABBIT_MQ],
    };
  }

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
