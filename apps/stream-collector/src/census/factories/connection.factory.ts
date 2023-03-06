import { Injectable } from '@nestjs/common';
import { Stream } from 'ps2census';
import { ConfigService } from '@nestjs/config';
import { StreamConductorService } from '../services/stream-conductor.service';
import { ConnectionContract } from '../concerns/connection.contract';
import { EssAdapter } from '../adapters/ess.adapter';

@Injectable()
export class ConnectionFactory {
  constructor(
    private readonly conductor: StreamConductorService,
    private readonly config: ConfigService,
  ) {}

  createConnection(): ConnectionContract {
    return new EssAdapter(this.createStream());
  }

  private createStream(): Stream.Client {
    return new Stream.Client(
      this.config.get('ess.serviceId'),
      this.config.get('ess.environment'),
    );
  }
}
