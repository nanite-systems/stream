import { Inject, Injectable } from '@nestjs/common';
import { PS2Environment, Stream } from 'ps2census';
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
import { PS2EventNames } from 'ps2census/stream';

export interface EssAdapterFactoryOptions {
  environment: PS2Environment;
  events: PS2EventNames[];
  worlds: string[];
  characters: string[];
  logicalAnd: boolean;
  subscriptionInterval: number;
  subscriptionTimeout: number;
}

@Injectable()
export class EssAdapterFactory {
  static readonly OPTIONS = Symbol(`options:${EssAdapterFactory.name}`);

  constructor(
    @Inject(EssAdapterFactory.OPTIONS)
    private readonly options: EssAdapterFactoryOptions,
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
      new Stream.Client(serviceId, this.options.environment),
      details,
      this.connectionReadyLatency,
      this.subscriptionAlterCounter,
      this.messageLatency,
      this.messageTimeoutCount,
      {
        eventNames: this.options.events,
        worlds: this.options.worlds,
        characters: this.options.characters,
        logicalAndCharactersWithWorlds: this.options.logicalAnd,
      },
      this.options.subscriptionInterval,
      this.options.subscriptionTimeout,
    );
  }
}
