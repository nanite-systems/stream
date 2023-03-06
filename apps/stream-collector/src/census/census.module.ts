import { Module } from '@nestjs/common';
import {
  CONDUCTOR_OPTIONS,
  StreamConductorService,
  StreamConductorServiceOptions,
} from './services/stream-conductor.service';
import { ConnectionFactory } from './factories/connection.factory';
import { CONNECTIONS, MANAGED_CONNECTIONS } from './constants';
import { StreamIndicator } from './indicators/stream.indicator';
import { StreamManagerService } from './services/stream-manager.service';
import { HEARTBEAT_OFFSET_ACCESSOR } from './concerns/heartbeat-offset-accessor.contract';
import {
  HEARTBEAT_OFFSET_ACCESSOR_OPTIONS,
  HeartbeatOffsetAccessor,
  HeartbeatOffsetAccessorOptions,
} from './utils/heartbeat-offset.accessor';
import { DELAY_POLICY } from './concerns/delay-policy.contract';
import {
  ALTERNATE_DELAY_POLICY_OPTIONS,
  AlternateDelayPolicy,
  AlternateDelayPolicyOptions,
} from './policies/delay/alternate-delay.policy';
import { ConnectionContract } from './concerns/connection.contract';
import { ManagedConnectionFactory } from './factories/managed-connection.factory';
import { ConfigService } from '@nestjs/config';

const range = (n: number) => Array.from(Array(n).keys());

@Module({
  providers: [
    ConnectionFactory,
    ManagedConnectionFactory,
    StreamConductorService,
    StreamManagerService,
    StreamIndicator,

    /** Options */
    {
      provide: HEARTBEAT_OFFSET_ACCESSOR_OPTIONS,
      useFactory: (config: ConfigService) =>
        ({
          heartbeatInterval: config.get('ess.heartbeatInterval'),
        } satisfies HeartbeatOffsetAccessorOptions),
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
        } satisfies AlternateDelayPolicyOptions),
      inject: [ConfigService],
    },
    {
      provide: CONDUCTOR_OPTIONS,
      useFactory: (config: ConfigService) =>
        ({
          minAcceptedOffsetThreshold: config.get(
            'ess.minAcceptedOffsetThreshold',
          ),
        } satisfies StreamConductorServiceOptions),
      inject: [ConfigService],
    },

    /** Satisfy contracts */
    {
      provide: HEARTBEAT_OFFSET_ACCESSOR,
      useClass: HeartbeatOffsetAccessor,
    },
    {
      provide: DELAY_POLICY,
      useClass: AlternateDelayPolicy,
    },

    /** Connections */
    {
      provide: CONNECTIONS,
      useFactory: (factory: ConnectionFactory, config: ConfigService) =>
        Object.freeze(
          range(config.get('ess.replication')).map(() =>
            factory.createConnection(),
          ),
        ),
      inject: [ConnectionFactory, ConfigService],
    },
    {
      provide: MANAGED_CONNECTIONS,
      useFactory: (
        connections: ConnectionContract[],
        factory: ManagedConnectionFactory,
      ) => Object.freeze(connections.map((c, i) => factory.create(i, c))),
      inject: [CONNECTIONS, ManagedConnectionFactory],
    },
  ],
  exports: [CONNECTIONS, StreamIndicator],
})
export class CensusModule {}
