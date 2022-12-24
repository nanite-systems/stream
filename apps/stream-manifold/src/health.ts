import { AppConfig } from './app.config';
import axios, { AxiosError } from 'axios';
import { ConfigModule } from '@nanite-systems/utils';

async function healthcheck() {
  ConfigModule.forRoot();

  const { port } = new AppConfig();

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
