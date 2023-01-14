import { DynamicModule, Module } from '@nestjs/common';
import { PS2Environment } from 'ps2census';
import {
  ClientProxyFactory,
  RmqOptions,
  Transport,
} from '@nestjs/microservices';
import { Options } from 'amqplib';
import { NssServiceConfig } from './nss-service.config';
import { RabbitMqConfig } from '../rabbitmq/rabbit-mq.config';
import { ConfigModule } from '@nss/utils';
import {
  NSS_PS2_CLIENT,
  NSS_PS2PS4EU_CLIENT,
  NSS_PS2PS4US_CLIENT,
  NSS_SERVICE_CONFIG,
} from './constants';

@Module({})
export class NssServiceModule {
  static forClient(): DynamicModule {
    return {
      module: NssServiceModule,
      imports: [ConfigModule.forFeature([NssServiceConfig, RabbitMqConfig])],
      providers: [
        {
          provide: NSS_PS2_CLIENT,
          useFactory: (nss: NssServiceConfig, rabbit: RabbitMqConfig) =>
            ClientProxyFactory.create(this.createConfig('ps2', nss, rabbit)),
          inject: [NssServiceConfig, RabbitMqConfig],
        },
        {
          provide: NSS_PS2PS4EU_CLIENT,
          useFactory: (nss: NssServiceConfig, rabbit: RabbitMqConfig) =>
            ClientProxyFactory.create(
              this.createConfig('ps2ps4eu', nss, rabbit),
            ),
          inject: [NssServiceConfig, RabbitMqConfig],
        },
        {
          provide: NSS_PS2PS4US_CLIENT,
          useFactory: (nss: NssServiceConfig, rabbit: RabbitMqConfig) =>
            ClientProxyFactory.create(
              this.createConfig('ps2ps4us', nss, rabbit),
            ),
          inject: [NssServiceConfig, RabbitMqConfig],
        },
      ],
      exports: [NSS_PS2_CLIENT, NSS_PS2PS4EU_CLIENT, NSS_PS2PS4US_CLIENT],
    };
  }

  static forService(environment: PS2Environment): DynamicModule {
    return {
      module: NssServiceModule,
      imports: [ConfigModule.forFeature([NssServiceConfig, RabbitMqConfig])],
      providers: [
        {
          provide: NSS_SERVICE_CONFIG,
          useFactory: (nss: NssServiceConfig, rabbit: RabbitMqConfig) =>
            this.createConfig(environment, nss, rabbit),
          inject: [NssServiceConfig, RabbitMqConfig],
        },
      ],
      exports: [NSS_SERVICE_CONFIG],
    };
  }

  private static createConfig(
    environment: PS2Environment,
    serviceConfig: NssServiceConfig,
    rabbitConfig: RabbitMqConfig,
  ): RmqOptions {
    const queue =
      (environment == 'ps2' && serviceConfig.queuePs2) ||
      (environment == 'ps2ps4eu' && serviceConfig.queuePs2ps4eu) ||
      (environment == 'ps2' && serviceConfig.queuePs2ps4us) ||
      `${serviceConfig.queuePrefix}${environment}`;

    return {
      transport: Transport.RMQ,
      options: {
        urls: [rabbitConfig.url],
        queue,
        queueOptions: {
          durable: false,
        } satisfies Options.AssertQueue,
      },
    };
  }
}
