import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
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

  process.on('uncaughtException', (err) => {
    logger.error(err, 'UncaughtException');
    process.exit(1);
  });

  await app.listen(config.get('app.port'), '0.0.0.0');
}

void bootstrap();
