import {
  Inject,
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ManagedConnection } from '../utils/managed-connection';
import { MANAGED_CONNECTIONS } from '../constants';

@Injectable()
export class StreamManagerService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  constructor(
    @Inject(MANAGED_CONNECTIONS)
    private readonly connections: ManagedConnection[],
  ) {}

  onApplicationBootstrap(): void {
    for (const connection of this.connections) connection.start();
  }

  onApplicationShutdown(): void {
    for (const connection of this.connections) connection.stop();
  }
}
