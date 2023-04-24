import { Module } from '@nestjs/common';
import { RedisModule } from '../redis/redis.module';
import {
  AUTH_SERVICE_OPTIONS,
  AuthService,
  AuthServiceOptions,
} from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { Axios } from 'axios';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [RedisModule],
  providers: [
    AuthService,

    {
      provide: AUTH_SERVICE_OPTIONS,
      useFactory: (config: ConfigService) =>
        ({
          salt: config.getOrThrow('auth.salt'),
          ttl: config.get('auth.ttl'),
        } satisfies AuthServiceOptions),
    },
    {
      provide: Axios,
      useFactory: () =>
        new Axios({
          baseURL: 'https://census.daybreakgames.com',
          maxRedirects: 0,
        }),
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
