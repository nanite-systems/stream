import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { config } from './config';
import { LoggerModule } from '@nss/utils';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      global: true,
      useFactory: () => ({
        level: config.log.level as any,
        pretty: config.log.pretty,
      }),
    }),
    PrometheusModule.register({ global: true }),
    CacheModule.register({ isGlobal: true }),
    AuthModule,
    HealthModule,
  ],
})
export class AppModule {}
