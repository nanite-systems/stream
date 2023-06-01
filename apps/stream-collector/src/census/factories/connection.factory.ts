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

  createConnection(serviceId: string): ConnectionContract {
    return new EssAdapter(
      this.createStream(serviceId),
      {
        eventNames: this.config.get('ess.events'),
        worlds: this.config.get('ess.worlds'),
        characters: this.config.get('ess.events'),
        logicalAndCharactersWithWorlds: this.config.get('ess.logicalAnd'),
      },
      this.config.get('ess.subscriptionInterval'),
    );
  }

  private createStream(serviceId: string): Stream.Client {
    return new Stream.Client(serviceId, this.config.get('ess.environment'));
  }
}
