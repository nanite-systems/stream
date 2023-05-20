import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from './config';
import { LoggerModule } from '@nss/utils';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [config],
    }),
    LoggerModule.forRootAsync({
      global: true,
      useFactory: (config: ConfigService) => ({
        level: config.get('log.level'),
        pretty: config.get('log.pretty'),
      }),
      inject: [ConfigService],
    }),
    PrometheusModule.register(),
    CacheModule.register({ isGlobal: true }),
    AuthModule,
    HealthModule,
  ],
})
export class AppModule {}
