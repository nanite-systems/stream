import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfig } from './app.config';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ClassSerializerInterceptor, Logger } from '@nestjs/common';
import { ConfigModule } from '@nss/utils';

async function bootstrap() {
  ConfigModule.forRoot();

  const appConfig = ConfigModule.resolve(AppConfig);

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      logger: appConfig.logLevels,
    },
  );

  app
    .enableShutdownHooks()
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

  await app.listen(appConfig.port, '0.0.0.0');
}

void bootstrap();
