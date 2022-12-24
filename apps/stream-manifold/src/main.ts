import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { WsAdapter } from '@nestjs/platform-ws';
import { AppConfig } from './app.config';
import { Logger } from '@nestjs/common';
import { ConfigModule } from '@nanite-systems/utils';

async function bootstrap() {
  ConfigModule.forRoot();

  const config = new AppConfig();

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      logger: config.logLevels,
    },
  );

  app.useWebSocketAdapter(new WsAdapter(app));
  app.enableShutdownHooks();

  process
    .on('unhandledRejection', (err) => {
      throw err;
    })
    .on('uncaughtException', (err) => {
      const logger = new Logger('UncaughtException');

      logger.error(err, err.stack);
      app.close();
      process.exit(1);
    });

  await app.listen(config.port, '0.0.0.0');
}

void bootstrap();
