import { Inject, Injectable } from '@nestjs/common';
import { hash } from 'bcryptjs';

export const TOKEN_EXCHANGE_SERVICE_OPTIONS = Symbol(
  'provide:token_exchange_service_options',
);

export interface TokenExchangeServiceOptions {
  salt: string;
}

@Injectable()
export class TokenExchangeService {
  constructor(
    @Inject(TOKEN_EXCHANGE_SERVICE_OPTIONS)
    private readonly options: TokenExchangeServiceOptions,
  ) {}

  async exchangeServiceId(serviceId: string): Promise<string> {
    const serviceIdHash = await hash(serviceId, this.options.salt);

    return serviceIdHash.slice(this.options.salt.length);
  }
}
