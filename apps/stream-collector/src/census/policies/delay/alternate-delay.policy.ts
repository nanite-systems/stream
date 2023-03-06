import { DelayPolicyContract } from '../../concerns/delay-policy.contract';
import { Inject, Injectable } from '@nestjs/common';

export const ALTERNATE_DELAY_POLICY_OPTIONS = Symbol(
  'provide:alternate_delay_policy_options',
);

export interface AlternateDelayPolicyOptions {
  reconnectDelay: number;
  cycleDelay: number;
  longCycleInterval: number;
  longCycleDelay: number;
}

@Injectable()
export class AlternateDelayPolicy implements DelayPolicyContract {
  constructor(
    @Inject(ALTERNATE_DELAY_POLICY_OPTIONS)
    private readonly options: AlternateDelayPolicyOptions,
  ) {}

  next(
    wasForcedDisconnect: boolean,
    retryCount: number,
    cycleCount: number,
  ): number {
    if (!wasForcedDisconnect) return this.options.reconnectDelay;
    if (cycleCount % this.options.longCycleInterval == 0)
      return this.options.longCycleDelay;

    return this.options.cycleDelay;
  }
}
