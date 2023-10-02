import { Module } from '@nestjs/common';
import { StreamConductorService } from './services/stream-conductor.service';
import { EssAdapterFactory } from './factories/ess-adapter.factory';
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
import { ConfigService } from '@nestjs/config';
import { ManagedConnectionsMetricsService } from './services/managed-connections-metrics.service';
import { EssAdapter } from './adapters/ess.adapter';
import { ConnectionDetails } from './utils/connection-details';
import { MetricModule } from './modules/metric.module';
import { DetailedConnectionContract } from './concerns/detailed-connection.contract';

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
      provide: ESS_ADAPTERS,
      useFactory: (config: ConfigService, factory: EssAdapterFactory) =>
        Object.freeze(
          config
            .getOrThrow<string[]>('ess.serviceIds')
            .map((serviceId, i) =>
              factory.create(serviceId, new ConnectionDetails(i + 1)),
            ),
        ),
      inject: [ConfigService, EssAdapterFactory],
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
