import { Module } from '@nestjs/common';
import { StreamGateway } from './stream.gateway';
import { BaseStreamFactory } from './factories/base-stream.factory';
import { StreamConnection } from './stream.connection';
import { DiscoveryModule, MetadataScanner } from '@nestjs/core';
import { BASE_STREAM, CENSUS_STREAM } from './constants';
import { GatewayMetadataExplorer } from '@nestjs/websockets/gateway-metadata-explorer';
import { provideFactory } from '../utils/provide.helpers';
import { CensusStreamFactory } from './factories/census-stream.factory';
import { EnvironmentsModule } from '../environments/environments.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { makeGaugeProvider } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [DiscoveryModule, EnvironmentsModule, SubscriptionModule],
  providers: [
    {
      provide: GatewayMetadataExplorer,
      useFactory: (scanner: MetadataScanner) =>
        new GatewayMetadataExplorer(scanner),
      inject: [MetadataScanner],
    },

    StreamGateway,
    StreamConnection,

    BaseStreamFactory,
    CensusStreamFactory,

    makeGaugeProvider({
      name: 'nss_connections',
      help: 'active connections to the manifold',
      labelNames: ['environment'],
    }),

    provideFactory(BASE_STREAM, BaseStreamFactory),
    provideFactory(CENSUS_STREAM, CensusStreamFactory),
  ],
})
export class StreamModule {}
