import { Module } from '@nestjs/common';
import { StreamConductorService } from './services/stream-conductor.service';
import {
  EssAdapterFactory,
  EssAdapterFactoryOptions,
} from './factories/ess-adapter.factory';
import {
  CONNECTIONS,
  DETAILED_CONNECTIONS,
  ESS_ADAPTERS,
  MANAGED_CONNECTIONS,
} from './constants';
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
import { ManagedConnectionsMetricsService } from './services/managed-connections-metrics.service';
import { EssAdapter } from './adapters/ess.adapter';
import { ConnectionDetails } from './utils/connection-details';
import { MetricModule } from './modules/metric.module';
import { DetailedConnectionContract } from './concerns/detailed-connection.contract';
import { config } from '../config';

@Module({
  imports: [MetricModule],
  providers: [
    EssAdapterFactory,
    ManagedConnectionFactory,

    StreamConductorService,
    StreamManagerService,
    StreamIndicator,

    /** Options */
    {
      provide: MANAGED_CONNECTION_FACTORY_OPTIONS,
      useFactory: () =>
        ({
          heartbeatInterval: config.ess.heartbeatInterval,
        }) satisfies ManagedConnectionFactoryOptions,
    },
    {
      provide: ALTERNATE_DELAY_POLICY_OPTIONS,
      useFactory: () =>
        ({
          reconnectDelay: config.ess.reconnectDelay,
          cycleDelay: config.ess.cycleDelay,
          longCycleInterval: config.ess.longCycleInterval,
          longCycleDelay: config.ess.longCycleDelay,
        }) satisfies AlternateDelayPolicyOptions,
    },
    {
      provide: EssAdapterFactory.OPTIONS,
      useFactory: () =>
        ({
          environment: config.ess.environment as any,
          events: config.ess.events as any,
          worlds: config.ess.worlds,
          characters: ['all'],
          logicalAnd: config.ess.logicalAnd,
          subscriptionInterval: config.ess.subscriptionInterval,
          subscriptionTimeout: config.ess.subscriptionTimeout,
        }) satisfies EssAdapterFactoryOptions,
    },

    /** Satisfy contracts */
    {
      provide: DELAY_POLICY,
      useClass: AlternateDelayPolicy,
    },

    /** Connections */
    {
      provide: ESS_ADAPTERS,
      useFactory: (factory: EssAdapterFactory) =>
        Object.freeze(
          config.ess.serviceIds.map((serviceId, i) =>
            factory.create(serviceId, new ConnectionDetails(i + 1)),
          ),
        ),
      inject: [EssAdapterFactory],
    },
    {
      provide: CONNECTIONS,
      useExisting: ESS_ADAPTERS,
    },
    {
      provide: MANAGED_CONNECTIONS,
      useFactory: (
        connections: EssAdapter[],
        factory: ManagedConnectionFactory,
      ) =>
        Object.freeze(
          connections.map((connection) =>
            factory.create(connection.details, connection),
          ),
        ),
      inject: [ESS_ADAPTERS, ManagedConnectionFactory],
    },

    {
      provide: DETAILED_CONNECTIONS,
      useFactory: (connections: EssAdapter[]) =>
        connections.map((connection) => ({
          details: connection.details,
          connection,
        })) satisfies DetailedConnectionContract[],
      inject: [ESS_ADAPTERS],
    },

    /** Metrics */
    ManagedConnectionsMetricsService,
  ],
  exports: [DETAILED_CONNECTIONS, StreamIndicator],
})
export class CensusModule {}
