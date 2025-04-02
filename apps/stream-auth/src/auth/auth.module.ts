import { Module } from '@nestjs/common';
import {
  TOKEN_EXCHANGE_SERVICE_OPTIONS,
  TokenExchangeService,
  TokenExchangeServiceOptions,
} from './services/token-exchange.service';
import {
  AUTH_CONTROLLER_OPTIONS,
  AuthController,
  AuthControllerOptions,
} from './controllers/auth.controller';
import { Axios } from 'axios';
import { ConfigService } from '@nestjs/config';
import { CENSUS_API } from './constants';
import { ServiceIdValidationService } from './services/service-id-validation.service';

@Module({
  providers: [
    TokenExchangeService,
    ServiceIdValidationService,

    {
      provide: TOKEN_EXCHANGE_SERVICE_OPTIONS,
      useFactory: (config: ConfigService) =>
        ({
          salt: config.getOrThrow('auth.salt'),
        }) satisfies TokenExchangeServiceOptions,
      inject: [ConfigService],
    },
    {
      provide: AUTH_CONTROLLER_OPTIONS,
      useFactory: (config: ConfigService) =>
        ({
          cacheTtl: config.get('auth.ttl'),
        }) satisfies AuthControllerOptions,
      inject: [ConfigService],
    },

    {
      provide: CENSUS_API,
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
