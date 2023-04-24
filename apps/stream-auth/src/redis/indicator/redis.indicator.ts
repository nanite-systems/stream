import { Inject, Injectable } from '@nestjs/common';
import { MicroserviceHealthIndicator } from '@nestjs/terminus';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { REDIS_OPTIONS } from '../constants';
import { RedisOptions } from 'ioredis';

@Injectable()
export class RedisIndicator {
  constructor(
    private readonly health: MicroserviceHealthIndicator,
    @Inject(REDIS_OPTIONS)
    private readonly options: RedisOptions,
  ) {}

  check(key: string) {
    return this.health.pingCheck<MicroserviceOptions>(key, {
      transport: Transport.REDIS,
      options: this.options,
    });
  }
}
