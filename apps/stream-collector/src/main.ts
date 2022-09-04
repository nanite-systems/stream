import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigModule } from '@census-reworked/nestjs-utils';
import { AppConfig } from './app.config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  ConfigModule.forRoot();

  const config = await ConfigModule.resolveConfig(AppConfig);

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: config.logLevels,
  });

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

  app.enableShutdownHooks();
}

void bootstrap();
