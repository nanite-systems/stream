import { Injectable } from '@nestjs/common';
import { Stream } from 'ps2census';
import { ConfigService } from '@nestjs/config';
import { ConnectionContract } from '../concerns/connection.contract';
import { EssAdapter } from '../adapters/ess.adapter';
import { ConnectionDetails } from '../utils/connection-details';
import { Logger } from '@nss/utils';
import { Counter, Summary } from 'prom-client';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import {
  essConnectionReadyLatencySeconds,
  essSubscriptionAlterationCount,
  essSubscriptionMessageLatencySeconds,
  essSubscriptionMessageTimeoutCount,
} from '../../metrics';

@Injectable()
export class EssAdapterFactory {
  constructor(
    private readonly config: ConfigService,
    private readonly logger: Logger,
    @InjectMetric(essConnectionReadyLatencySeconds)
    private readonly connectionReadyLatency: Summary,
    @InjectMetric(essSubscriptionAlterationCount)
    private readonly subscriptionAlterCounter: Counter,
    @InjectMetric(essSubscriptionMessageLatencySeconds)
    private readonly messageLatency: Summary,
    @InjectMetric(essSubscriptionMessageTimeoutCount)
    private readonly messageTimeoutCount: Counter,
  ) {}

  create(serviceId: string, details: ConnectionDetails): ConnectionContract {
    return new EssAdapter(
      this.logger,
      new Stream.Client(serviceId, this.config.get('ess.environment')),
      details,
      this.connectionReadyLatency,
      this.subscriptionAlterCounter,
      this.messageLatency,
      this.messageTimeoutCount,
      {
        eventNames: this.config.get('ess.events'),
        worlds: this.config.get('ess.worlds'),
        characters: this.config.get('ess.events'),
        logicalAndCharactersWithWorlds: this.config.get('ess.logicalAnd'),
      },
      this.config.get('ess.subscriptionInterval'),
      this.config.get('ess.subscriptionTimeout'),
    );
  }
}
