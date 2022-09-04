import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppConfig } from './app.config';
import { ConfigModule } from '@census-reworked/nestjs-utils';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';

async function bootstrap() {
  ConfigModule.forRoot();

  const config = await ConfigModule.resolveConfig(AppConfig);

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      logger: config.logLevels,
    },
  );

  app
    .enableShutdownHooks()
    .useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    )
    .useGlobalInterceptors(new ClassSerializerInterceptor(new Reflector()));

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
