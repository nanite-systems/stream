import { DynamicModule, Module } from '@nestjs/common';
import { PS2Environment } from 'ps2census';
import { ClientsModule, RmqOptions, Transport } from '@nestjs/microservices';
import { Options } from 'amqplib';
import { NssServiceConfig } from './nss-service.config';
import { RabbitMqConfig } from '../rabbitmq/rabbit-mq.config';
import { ConfigModule } from '@nss/utils';
import { NSS_PS2_CLIENT, NSS_SERVICE_CONFIG } from './constants';

@Module({})
export class NssServiceModule {
  static forClient(): DynamicModule {
    return {
      module: NssServiceModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name: NSS_PS2_CLIENT,
            useFactory: (nss: NssServiceConfig, rabbit: RabbitMqConfig) =>
              this.createConfig('ps2', nss, rabbit),
            inject: [NssServiceConfig, RabbitMqConfig],
            imports: [
              ConfigModule.forFeature([NssServiceConfig, RabbitMqConfig]),
            ],
          },
          {
            name: NSS_PS2_CLIENT,
            useFactory: (nss: NssServiceConfig, rabbit: RabbitMqConfig) =>
              this.createConfig('ps2', nss, rabbit),
            inject: [NssServiceConfig, RabbitMqConfig],
            imports: [
              ConfigModule.forFeature([NssServiceConfig, RabbitMqConfig]),
            ],
          },
          {
            name: NSS_PS2_CLIENT,
            useFactory: (nss: NssServiceConfig, rabbit: RabbitMqConfig) =>
              this.createConfig('ps2', nss, rabbit),
            inject: [NssServiceConfig, RabbitMqConfig],
            imports: [
              ConfigModule.forFeature([NssServiceConfig, RabbitMqConfig]),
            ],
          },
        ]),
      ],
      exports: [ClientsModule],
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
