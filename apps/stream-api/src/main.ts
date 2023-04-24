import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { RmqOptions, Transport } from '@nestjs/microservices';
import { Options } from 'amqplib';
import { Logger } from '@nss/utils';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      bufferLogs: true,
      autoFlushLogs: false,
    },
  );

  const config = await app.resolve(ConfigService);
  const logger = await app.resolve(Logger);

  app.useLogger(logger);
  app.flushLogs();
  app.enableShutdownHooks();

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: config.get('rabbitmq.urls'),
      queue: config.get('rabbitmq.apiQueueName'),
      queueOptions: {
        durable: false,
      } satisfies Options.AssertQueue,
    },
  } satisfies RmqOptions);

  process.on('uncaughtException', (err) => {
    logger.error(err, 'UncaughtException');
    process.exit(1);
  });

  await app.startAllMicroservices();
  await app.listen(config.get('app.port'), '0.0.0.0');
}

void bootstrap();
