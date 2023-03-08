import { ManagedConnection } from '../utils/managed-connection';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConnectionContract } from '../concerns/connection.contract';
import {
  HEARTBEAT_OFFSET_ACCESSOR,
  HeartbeatOffsetAccessorContract,
} from '../concerns/heartbeat-offset-accessor.contract';
import {
  DELAY_POLICY,
  DelayPolicyContract,
} from '../concerns/delay-policy.contract';
import { StreamConductorService } from '../services/stream-conductor.service';

@Injectable()
export class ManagedConnectionFactory {
  constructor(
    @Inject(HEARTBEAT_OFFSET_ACCESSOR)
    private readonly offsetAccessor: HeartbeatOffsetAccessorContract,
    @Inject(DELAY_POLICY)
    private readonly delayPolicy: DelayPolicyContract,
    private readonly conductor: StreamConductorService,
  ) {}

  create(id: number, connection: ConnectionContract): ManagedConnection {
    return new ManagedConnection(
      new Logger(`Connection-${id}`),
      connection,
      this.offsetAccessor,
      this.delayPolicy,
      this.conductor,
    );
  }
}
