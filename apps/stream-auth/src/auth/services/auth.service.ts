import { Injectable, Logger } from '@nestjs/common';
import { Axios } from 'axios';
import { hash } from 'bcryptjs';
import IORedis from 'ioredis';
import { ValidationResponse } from '../entities/validation-response.entity';

export const AUTH_SERVICE_OPTIONS = Symbol('provide:auth_service_options');

export interface AuthServiceOptions {
  salt: string;
  ttl: number;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger('Auth');

  constructor(
    private readonly http: Axios,
    private readonly redis: IORedis,
    private readonly options: AuthServiceOptions,
  ) {}

  validateServiceId(serviceId: string): boolean {
    if (!serviceId.startsWith('s:')) return false;

    return /^[a-z0-9]+$/i.test(serviceId.slice(2)) && serviceId != 's:example';
  }

  async checkServiceId(serviceId: string): Promise<ValidationResponse> {
    const serviceIdHash = await hash(serviceId, this.options.salt);
    const token = serviceIdHash.slice(this.options.salt.length);
    const cachedCheck: boolean | null = JSON.parse(await this.redis.get(token));

    if (cachedCheck !== null) {
      return new ValidationResponse(cachedCheck, token);
    }

    const check = await this.checkServiceIdAgainstCensus(serviceId);
    await this.redis.setex(token, this.options.ttl, JSON.stringify(check));

    this.logger.log(`Checked ${serviceIdHash} against Census: ${check}`);

    return new ValidationResponse(check, token);
  }

  private async checkServiceIdAgainstCensus(
    serviceId: string,
  ): Promise<boolean> {
    const { data } = await this.http.get(`/${serviceId}/get/ps2:v2/`);

    return !('error' in JSON.parse(data));
  }
}
