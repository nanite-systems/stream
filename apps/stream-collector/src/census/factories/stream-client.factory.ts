import { Injectable } from '@nestjs/common';
import { Stream } from 'ps2census';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StreamClientFactory {
  constructor(private readonly config: ConfigService) {}

  create(serviceId: string): Stream.Client {
    return new Stream.Client(serviceId, this.config.get('ess.environment'));
  }
}
