import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfig } from './app.config';
import { Logger } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ConfigModule } from '@nss/utils';
import { NSS_SERVICE_CONFIG } from '@nss/rabbitmq';

async function bootstrap() {
  ConfigModule.forRoot();

  const config = ConfigModule.resolve(AppConfig);

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      logger: config.logLevels,
    },
  );

  app.connectMicroservice(app.get(NSS_SERVICE_CONFIG));

  process
    .on('unhandledRejection', (err) => {
      throw err;
    })
    .on('uncaughtException', async (err) => {
      const logger = new Logger('UncaughtException');

      logger.error(err, err.stack);
      await app.close();
      process.exit(1);
    });

  app.enableShutdownHooks();

  await app.startAllMicroservices();
  await app.listen(config.port, '0.0.0.0');
}

void bootstrap();
