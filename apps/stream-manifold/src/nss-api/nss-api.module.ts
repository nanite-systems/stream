import { Module } from '@nestjs/common';
import { ClientsModule, RmqOptions, Transport } from '@nestjs/microservices';
import { NSS_API_CLIENT } from './constants';
import { ConfigService } from '@nestjs/config';
import { Options } from 'amqplib';
import { NssApiService } from './services/nss-api.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: NSS_API_CLIENT,
        useFactory: (config: ConfigService) =>
          ({
            transport: Transport.RMQ,
            options: {
              urls: config.get('rabbitmq.urls'),
              queue: config.get('rabbitmq.apiQueueName'),
              queueOptions: {
                durable: false,
              } satisfies Options.AssertQueue,
            },
          } satisfies RmqOptions),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [NssApiService],
  exports: [NssApiService],
})
export class NssApiModule {}
