import { Injectable } from '@nestjs/common';
import { Stream } from 'ps2census';
import { ConfigService } from '@nestjs/config';
import { ConnectionContract } from '../concerns/connection.contract';
import { EssAdapter } from '../adapters/ess.adapter';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';
import { essConnectionSubscriptionAlterationCount } from '../../metrics';
import { Logger } from '@nss/utils';

@Injectable()
export class EssAdapterFactory {
  constructor(
    private readonly config: ConfigService,
    private readonly logger: Logger,
    @InjectMetric(essConnectionSubscriptionAlterationCount)
    private readonly subscriptionAlterCounter: Counter,
  ) {}

  create(id: number, client: Stream.Client): ConnectionContract {
    return new EssAdapter(
      `Connection-${id}`,
      client,
      this.subscriptionAlterCounter,
      this.logger,
      {
        eventNames: this.config.get('ess.events'),
        worlds: this.config.get('ess.worlds'),
        characters: this.config.get('ess.events'),
        logicalAndCharactersWithWorlds: this.config.get('ess.logicalAnd'),
      },
      this.config.get('ess.subscriptionInterval'),
    );
  }
}
