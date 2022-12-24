import {
  Inject,
  Logger,
  Module,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { CensusClient } from 'ps2census';
import {
  CENSUS_CLIENTS,
  PC_CLIENT,
  PS4_EU_CLIENT,
  PS4_US_CLIENT,
} from './constants';
import { ConfigModule } from '@nanite-systems/utils';
import { CensusConfig } from './census.config';
import { CensusClientFactory } from './factories/census-client.factory';
import { CensusIndicator } from './indicator/census.indicator';

@Module({
  imports: [ConfigModule.forFeature([CensusConfig])],
  providers: [
    CensusClientFactory,
    CensusIndicator,

    {
      provide: PC_CLIENT,
      useFactory: (factory: CensusClientFactory) => factory.create('ps2'),
      inject: [CensusClientFactory],
    },
    {
      provide: PS4_US_CLIENT,
      useFactory: (factory: CensusClientFactory) => factory.create('ps2ps4us'),
      inject: [CensusClientFactory],
    },
    {
      provide: PS4_EU_CLIENT,
      useFactory: (factory: CensusClientFactory) => factory.create('ps2ps4eu'),
      inject: [CensusClientFactory],
    },
    {
      provide: CENSUS_CLIENTS,
      useFactory: (...clients: CensusClient[]) => clients,
      inject: [PC_CLIENT, PS4_US_CLIENT, PS4_EU_CLIENT],
    },
  ],
  exports: [
    PC_CLIENT,
    PS4_US_CLIENT,
    PS4_EU_CLIENT,
    CENSUS_CLIENTS,
    CensusIndicator,
  ],
})
export class CensusModule
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  constructor(
    @Inject(CENSUS_CLIENTS) private readonly clients: CensusClient[],
  ) {
    clients.forEach((client) => {
      const logger = new Logger(`CensusClient:${client.environment}`);

      client.on('ready', () => {
        logger.log('Connected');
      });

      client.on('reconnecting', () => {
        logger.log('Reconnecting');
      });

      client.on('disconnected', () => {
        logger.log('Disconnected');
      });
    });
  }

  async onApplicationBootstrap(): Promise<void> {
    await Promise.all(
      this.clients.map((client) => {
        void client.watch();
      }),
    );
  }

  onApplicationShutdown(): void {
    this.clients.forEach((client) => {
      client.destroy();
    });
  }
}
