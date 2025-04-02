import { Module } from '@nestjs/common';
import { ClientsModule, RmqOptions, Transport } from '@nestjs/microservices';
import { NSS_API_CLIENT } from './constants';
import { Options } from 'amqplib';
import { NssApiService } from './services/nss-api.service';
import { config } from '../config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: NSS_API_CLIENT,
        useFactory: () =>
          ({
            transport: Transport.RMQ,
            options: {
              urls: config.rabbitmq.urls,
              queue: config.rabbitmq.apiQueueName,
              queueOptions: {
                durable: false,
              } satisfies Options.AssertQueue,
            },
          }) satisfies RmqOptions,
      },
    ]),
  ],
  providers: [NssApiService],
  exports: [NssApiService],
})
export class NssApiModule {}
