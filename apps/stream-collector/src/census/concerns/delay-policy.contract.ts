export const DELAY_POLICY = Symbol('provide:delay_policy');

export interface DelayPolicyContract {
  next(
    wasForcedDisconnect: boolean,
    retryCount: number,
    cycleCount: number,
  ): number;
}
