import { Module } from '@nestjs/common';
import { StreamConductorService } from './services/stream-conductor.service';
import { EssAdapterFactory } from './factories/ess-adapter.factory';
import { CONNECTIONS, MANAGED_CONNECTIONS, STREAM_CLIENTS } from './constants';
import { StreamIndicator } from './indicators/stream.indicator';
import { StreamManagerService } from './services/stream-manager.service';
import { DELAY_POLICY } from './concerns/delay-policy.contract';
import {
  ALTERNATE_DELAY_POLICY_OPTIONS,
  AlternateDelayPolicy,
  AlternateDelayPolicyOptions,
} from './policies/delay/alternate-delay.policy';
import {
  MANAGED_CONNECTION_FACTORY_OPTIONS,
  ManagedConnectionFactory,
  ManagedConnectionFactoryOptions,
} from './factories/managed-connection.factory';
import { ConfigService } from '@nestjs/config';
import {
  makeCounterProvider,
  makeGaugeProvider,
} from '@willsoto/nestjs-prometheus';
import { CensusMetricsService } from './services/census-metrics.service';
import { StreamClientFactory } from './factories/stream-client.factory';
import { Stream } from 'ps2census';
import {
  essConnectionClockOffsetSeconds,
  essConnectionHeartbeatOffsetSeconds,
  essConnectionStartTimeSeconds,
  essConnectionStateCount,
  essConnectionStateTotal,
  essConnectionSubscriptionAlterationCount,
} from '../metrics';
import { EssAdapter } from './adapters/ess.adapter';

@Module({
  providers: [
    StreamClientFactory,
    EssAdapterFactory,
    ManagedConnectionFactory,
    StreamConductorService,
    StreamManagerService,
    StreamIndicator,

    /** Options */
    {
      provide: MANAGED_CONNECTION_FACTORY_OPTIONS,
      useFactory: (config: ConfigService) =>
        ({
          heartbeatInterval: config.get('ess.heartbeatInterval'),
        }) satisfies ManagedConnectionFactoryOptions,
      inject: [ConfigService],
    },
    {
      provide: ALTERNATE_DELAY_POLICY_OPTIONS,
      useFactory: (config: ConfigService) =>
        ({
          reconnectDelay: config.get('ess.reconnectDelay'),
          cycleDelay: config.get('ess.cycleDelay'),
          longCycleInterval: config.get('ess.longCycleInterval'),
          longCycleDelay: config.get('ess.longCycleDelay'),
        }) satisfies AlternateDelayPolicyOptions,
      inject: [ConfigService],
    },

    /** Satisfy contracts */
    {
      provide: DELAY_POLICY,
      useClass: AlternateDelayPolicy,
    },

    /** Connections */
    {
      provide: STREAM_CLIENTS,
      useFactory: (factory: StreamClientFactory, config: ConfigService) =>
        Object.freeze(
          config
            .getOrThrow('ess.serviceIds')
            .map((serviceId) => factory.create(serviceId)),
        ),
      inject: [StreamClientFactory, ConfigService],
    },
    {
      provide: CONNECTIONS,
      useFactory: (clients: Stream.Client[], factory: EssAdapterFactory) =>
        Object.freeze(clients.map((client, id) => factory.create(id, client))),
      inject: [STREAM_CLIENTS, EssAdapterFactory],
    },
    {
      provide: MANAGED_CONNECTIONS,
      useFactory: (
        connections: EssAdapter[],
        factory: ManagedConnectionFactory,
      ) =>
        Object.freeze(
          connections.map((connection) =>
            factory.create(connection.label, connection),
          ),
        ),
      inject: [CONNECTIONS, ManagedConnectionFactory],
    },

    /** Metrics */
    CensusMetricsService,

    makeGaugeProvider({
      name: essConnectionStartTimeSeconds,
      help: 'Start time of ess connection unix epoch',
      labelNames: ['connection'],
    }),
    makeGaugeProvider({
      name: essConnectionHeartbeatOffsetSeconds,
      help: 'Residual of unix epoch divided by heartbeat interval',
      labelNames: ['connection'],
    }),
    makeCounterProvider({
      name: essConnectionStateCount,
      help: 'Counter that tracks disconnects',
      labelNames: ['connection', 'type'],
    }),
    makeGaugeProvider({
      name: essConnectionStateTotal,
      help: 'Current number of connections in a certain state',
      labelNames: ['type'],
    }),

    makeCounterProvider({
      name: essConnectionSubscriptionAlterationCount,
      help: 'Counter that tracks how many times a subscription to a connection has been altered',
      labelNames: ['connection'],
    }),

    makeGaugeProvider({
      name: essConnectionClockOffsetSeconds,
      help: 'Clock offset between ess and system',
      labelNames: ['connection'],
    }),
  ],
  exports: [CONNECTIONS, StreamIndicator],
})
export class CensusModule {}
