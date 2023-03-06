import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
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

  process.on('uncaughtException', async (err) => {
    const logger = new Logger('UncaughtException');

    logger.error(err, err.stack);
    process.exit(1);
  });

  app.enableShutdownHooks();

  await app.listen(config.get('app.port'), '0.0.0.0');
}

void bootstrap();
