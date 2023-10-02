import { ManagedConnection } from '../utils/managed-connection';
import { Inject, Injectable } from '@nestjs/common';
import { ConnectionContract } from '../concerns/connection.contract';
import {
  DELAY_POLICY,
  DelayPolicyContract,
} from '../concerns/delay-policy.contract';
import { StreamConductorService } from '../services/stream-conductor.service';
import { Logger } from '@nss/utils';
import { ConnectionDetails } from '../utils/connection-details';

export const MANAGED_CONNECTION_FACTORY_OPTIONS = Symbol(
  'provide:managed_connection_factory_options',
);

export interface ManagedConnectionFactoryOptions {
  heartbeatInterval: number;
}

@Injectable()
export class ManagedConnectionFactory {
  constructor(
    @Inject(DELAY_POLICY)
    private readonly delayPolicy: DelayPolicyContract,
    private readonly conductor: StreamConductorService,
    private readonly logger: Logger,
    @Inject(MANAGED_CONNECTION_FACTORY_OPTIONS)
    private readonly options: ManagedConnectionFactoryOptions,
  ) {}

  create(
    details: ConnectionDetails,
    connection: ConnectionContract,
  ): ManagedConnection {
    return new ManagedConnection(
      details,
      this.logger,
      connection,
      this.delayPolicy,
      this.conductor,
      this.options.heartbeatInterval,
    );
  }
}
