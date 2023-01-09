import {
  Module,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { CensusConfig } from './census.config';
import { CensusClient } from 'ps2census';
import { CensusClientFactory } from './factories/census-client.factory';
import { RestClientFactory } from './factories/rest-client.factory';
import { PC_REST, PS4EU_REST, PS4US_REST } from './constants';
import { ConfigModule } from '@nss/utils';

@Module({
  imports: [ConfigModule.forFeature([CensusConfig])],
  providers: [
    CensusClientFactory,
    RestClientFactory,

    {
      provide: CensusClient,
      useFactory: (factory: CensusClientFactory) => factory.create(),
      inject: [CensusClientFactory],
    },
    {
      provide: PC_REST,
      useFactory: (factory: RestClientFactory) => factory.create('ps2'),
      inject: [RestClientFactory],
    },
    {
      provide: PS4EU_REST,
      useFactory: (factory: RestClientFactory) => factory.create('ps2ps4eu'),
      inject: [RestClientFactory],
    },
    {
      provide: PS4US_REST,
      useFactory: (factory: RestClientFactory) => factory.create('ps2ps4us'),
      inject: [RestClientFactory],
    },
  ],
  exports: [CensusClient, PC_REST, PS4EU_REST, PS4US_REST],
})
export class CensusModule
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  constructor(private readonly client: CensusClient) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.client.watch();
  }

  onApplicationShutdown(): void {
    this.client.destroy();
  }
}
