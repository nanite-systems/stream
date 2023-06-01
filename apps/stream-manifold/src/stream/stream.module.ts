import { Module, Scope } from '@nestjs/common';
import { StreamGateway } from './stream.gateway';
import { BaseStreamFactory } from './factories/base-stream.factory';
import { StreamConnection } from './stream.connection';
import { DiscoveryModule, MetadataScanner } from '@nestjs/core';
import { BASE_STREAM, CENSUS_STREAM, SESSION_ID } from './constants';
import { GatewayMetadataExplorer } from '@nestjs/websockets/gateway-metadata-explorer';
import { provideFactory } from '../utils/provide.helpers';
import { CensusStreamFactory } from './factories/census-stream.factory';
import { EnvironmentsModule } from '../environments/environments.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { makeCounterProvider } from '@willsoto/nestjs-prometheus';
import { NssApiModule } from '../nss-api/nss-api.module';
import { randomUUID } from 'crypto';
import {
  CONNECTION_ACCESSOR_OPTIONS,
  ConnectionAccessorOptions,
  RequestAccessor,
} from './utils/request.accessor';
import { ConfigService } from '@nestjs/config';
import { CommandCountInterceptor } from './interceptors/command-count.interceptor';

@Module({
  imports: [
    DiscoveryModule,
    EnvironmentsModule,
    SubscriptionModule,
    NssApiModule,
  ],
  providers: [
    {
      provide: GatewayMetadataExplorer,
      useFactory: (scanner: MetadataScanner) =>
        new GatewayMetadataExplorer(scanner),
      inject: [MetadataScanner],
    },

    {
      provide: SESSION_ID,
      useFactory: () => randomUUID(),
      scope: Scope.REQUEST,
    },

    {
      provide: CONNECTION_ACCESSOR_OPTIONS,
      useFactory: (config: ConfigService) =>
        ({
          tokenHeader: config.get('http.authTokenHeader'),
          behindProxy: config.get('http.behindProxy'),
        } satisfies ConnectionAccessorOptions),
      inject: [ConfigService],
    },
    RequestAccessor,

    CommandCountInterceptor,

    StreamGateway,
    StreamConnection,

    BaseStreamFactory,
    CensusStreamFactory,

    makeCounterProvider({
      name: 'nss_connection_change_count',
      help: 'connects and disconnect counter to different environments',
      labelNames: ['environment', 'type'],
    }),
    makeCounterProvider({
      name: 'nss_command_count',
      help: 'commands received by the manifold',
      labelNames: ['command', 'environment'],
    }),
    makeCounterProvider({
      name: 'nss_message_count',
      help: 'messages send out by the manifold',
      labelNames: ['world', 'event'],
    }),

    provideFactory(BASE_STREAM, BaseStreamFactory),
    provideFactory(CENSUS_STREAM, CensusStreamFactory),
  ],
})
export class StreamModule {}
