import { Injectable, Logger } from '@nestjs/common';
import { Stream } from 'ps2census';
import { StreamManagerService } from '../services/stream-manager.service';
import { IdBroker } from '../utils/id.broker';
import { EssConfig } from '../config/ess.config';
import { SubscriptionConfig } from '../config/subscription.config';

@Injectable()
export class StreamFactory {
  constructor(
    private readonly idBroker: IdBroker,
    private readonly config: EssConfig,
    private readonly subscription: SubscriptionConfig,
  ) {}

  createStream(): Stream.Client {
    return new Stream.Client(this.config.serviceId, this.config.environment);
  }

  createManagedStream(): StreamManagerService {
    return new StreamManagerService(
      this.createStream(),
      new Logger(`Stream${this.idBroker.createId()}`),
      this.config,
      this.subscription,
    );
  }
}
