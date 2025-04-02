import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Logger } from '@nss/utils';
import { config } from './config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      bufferLogs: true,
      autoFlushLogs: false,
    },
  );

  const logger = await app.resolve(Logger);

  app.useLogger(logger);
  app.flushLogs();
  app.enableShutdownHooks();

  process.on('uncaughtException', (err) => {
    logger.error(err, 'UncaughtException');
    app.flushLogs();
    process.exit(1);
  });

  await app.listen(config.app.port, '0.0.0.0');
}

void bootstrap();
