import { NestFactory } from '@nestjs/core';
import { ConfigModule } from '@census-reworked/nestjs-utils';
import { AppConfig } from './app.config';
import axios, { AxiosError } from 'axios';

async function healthcheck() {
  ConfigModule.forRoot();

  const app = await NestFactory.createApplicationContext(
    ConfigModule.forFeature([AppConfig]),
    { logger: false },
  );

  const { port } = await app.resolve(AppConfig);

  try {
    const { data } = await axios.get(`http://localhost:${port}/health`);

    console.log(data);
    process.exit(0);
  } catch (err) {
    console.error(
      err instanceof AxiosError
        ? err.response?.data ?? err.message
        : err.toString(),
    );
    process.exit(1);
  }
}

void healthcheck();
