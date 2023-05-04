import {
  Controller,
  ForbiddenException,
  Get,
  Headers,
  HttpStatus,
  Inject,
  Res,
  UseFilters,
} from '@nestjs/common';
import { TokenExchangeService } from '../services/token-exchange.service';
import { ServiceIdValidationService } from '../services/service-id-validation.service';
import { FastifyReply } from 'fastify';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { SimpleFormatFilter } from '../../utils/filters/simple-format.filter';

export const AUTH_CONTROLLER_OPTIONS = Symbol(
  'provide:auth_controller_options',
);

export interface AuthControllerOptions {
  cacheTtl: number;
}

@Controller()
@UseFilters(new SimpleFormatFilter())
export class AuthController {
  constructor(
    private readonly exchange: TokenExchangeService,
    private readonly validationService: ServiceIdValidationService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    @Inject(AUTH_CONTROLLER_OPTIONS)
    private readonly options: AuthControllerOptions,
  ) {}

  @Get('auth')
  async authenticate(
    @Res() response: FastifyReply,
    @Headers('X-Forwarded-Uri') url: string,
  ) {
    const serviceId = this.extractServiceId(url);

    const token = await this.exchange.exchangeServiceId(serviceId);
    let isValid = await this.cache.get<boolean>(token);

    if (isValid == undefined) {
      isValid = await this.validationService.validate(serviceId);
      await this.cache.set(token, isValid, this.options.cacheTtl);
    }

    if (!isValid) throw new ForbiddenException();

    response.code(HttpStatus.OK).header('X-Auth-Token', token).send();
  }

  private extractServiceId(url?: string): string {
    const i = url?.indexOf('?');
    if (i == undefined || i < 0) return null;

    const params = new URLSearchParams(url.slice(i));

    return params.get('service-id');
  }
}
