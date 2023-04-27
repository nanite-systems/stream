import { Logger, Module } from '@nestjs/common';
import IORedis, { RedisOptions } from 'ioredis';
import { TerminusModule } from '@nestjs/terminus';
import { RedisIndicator } from './indicator/redis.indicator';
import { ConfigService } from '@nestjs/config';
import { REDIS_OPTIONS } from './constants';

@Module({
  imports: [TerminusModule.forRoot({ logger: false })],
  providers: [
    RedisIndicator,

    {
      provide: REDIS_OPTIONS,
      useFactory: (config: ConfigService) =>
        ({
          host: config.get('redis.host'),
          port: config.get('redis.port'),
          username: config.get('redis.username'),
          password: config.get('redis.password'),
          db: config.get('redis.db'),
        } satisfies RedisOptions),
      inject: [ConfigService],
    },
    {
      provide: IORedis,
      useFactory: (options: RedisOptions) => new IORedis(options),
      inject: [REDIS_OPTIONS],
    },
  ],
  exports: [IORedis, RedisIndicator],
})
export class RedisModule {
  private readonly logger = new Logger('Redis');

  constructor(private readonly redis: IORedis) {
    redis.on('connect', () => {
      this.logger.log('Connected');
    });

    redis.on('reconnecting', () => {
      this.logger.log('Reconnecting');
    });

    redis.on('error', (err) => {
      this.logger.error(err.toString());
    });
  }
}
