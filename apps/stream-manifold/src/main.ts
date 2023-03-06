import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      bufferLogs: true,
    },
  );

  const config = await app.resolve(ConfigService);

  app.useLogger(config.get('log.levels'));

  app.useWebSocketAdapter(new WsAdapter(app)).enableShutdownHooks();

  process.on('uncaughtException', (err) => {
    const logger = new Logger('App');

    logger.error(err, err.stack);
    process.exit(1);
  });

  await app.listen(config.get('app.port'), '0.0.0.0');
}

void bootstrap();
