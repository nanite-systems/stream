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
import { CENSUS_API } from './constants';
import { ServiceIdValidationService } from './services/service-id-validation.service';
import { config } from '../config';

@Module({
  providers: [
    TokenExchangeService,
    ServiceIdValidationService,

    {
      provide: TOKEN_EXCHANGE_SERVICE_OPTIONS,
      useFactory: () =>
        ({
          salt: config.auth.salt,
        }) satisfies TokenExchangeServiceOptions,
    },
    {
      provide: AUTH_CONTROLLER_OPTIONS,
      useFactory: () =>
        ({
          cacheTtl: config.auth.ttl,
        }) satisfies AuthControllerOptions,
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
