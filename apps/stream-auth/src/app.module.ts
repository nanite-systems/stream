import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from './config';
import { LoggerModule } from '@nss/utils';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
    AuthModule,
    HealthModule,
  ],
})
export class AppModule {}
