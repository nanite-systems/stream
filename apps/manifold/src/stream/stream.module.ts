import { Module } from '@nestjs/common';
import { StreamGateway } from './stream.gateway';
import { BaseStreamFactory } from './factories/base-stream.factory';
import { StreamConnection } from './stream.connection';
import { DiscoveryModule, MetadataScanner } from '@nestjs/core';
import { BASE_STREAM, CENSUS_STREAM } from './constants';
import { GatewayMetadataExplorer } from '@nestjs/websockets/gateway-metadata-explorer';
import { provideFactory } from '../utils/provide.helpers';
import { CensusStreamFactory } from './factories/census-stream.factory';
import { RabbitMqModule } from '../rabbit-mq/rabbit-mq.module';
import { EnvironmentsModule } from '../environments/environments.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { MultiplexerModule } from '../multiplexer/multiplexer.module';
import { ConfigModule } from '@census-reworked/nestjs-utils';
import { StreamConfig } from './stream.config';

@Module({
  imports: [
    ConfigModule.forFeature([StreamConfig]),
    DiscoveryModule,
    RabbitMqModule,
    EnvironmentsModule,
    SubscriptionModule,
    MultiplexerModule,
  ],
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

    provideFactory(BASE_STREAM, BaseStreamFactory),
    provideFactory(CENSUS_STREAM, CensusStreamFactory),
  ],
})
export class StreamModule {}
