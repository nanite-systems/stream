import { Module } from '@nestjs/common';
import { StreamManagerService } from './services/stream-manager.service';
import { Stream } from 'ps2census';
import { CensusConfig } from './census.config';
import { ConfigModule } from '@census-reworked/nestjs-utils';

@Module({
  imports: [ConfigModule.forFeature([CensusConfig])],
  providers: [
    StreamManagerService,

    {
      provide: Stream.Client,
      useFactory: (config: CensusConfig) =>
        new Stream.Client(config.serviceId, config.environment, {
          endpoint: config.endpoint,
        }),
      inject: [CensusConfig],
    },
  ],
  exports: [Stream.Client],
})
export class CensusModule {}
