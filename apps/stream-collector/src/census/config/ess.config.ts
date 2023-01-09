import { BoolTransform, ProcessEnv } from '@nss/utils';
import { Transform } from 'class-transformer';
import { PS2Environment } from 'ps2census';

export class EssConfig {
  @ProcessEnv('SERVICE_ID')
  readonly serviceId;

  @ProcessEnv('PS2_ENVIRONMENT')
  readonly environment: PS2Environment;

  @ProcessEnv('HEARTBEAT_INTERVAL')
  @Transform(({ value }) => parseInt(value, 10) * 1000)
  readonly heartbeatInterval = 30 * 1000;

  @ProcessEnv('SUBSCRIPTION_INTERVAL')
  @Transform(({ value }) => parseInt(value, 10) * 1000)
  readonly subscriptionInterval = 60 * 1000;

  @ProcessEnv('STREAM_REPLICATION')
  readonly replication = 4;

  @ProcessEnv('RECONNECT_DELAY')
  @Transform(({ value }) => parseInt(value, 10) * 1000)
  readonly reconnectDelay = 5 * 1000;

  @ProcessEnv('HEARTBEAT_DIFF_THRESHOLD')
  @Transform(({ value }) => parseInt(value, 10))
  readonly heartbeatDiffThreshold = 300;

  @ProcessEnv('HEARTBEAT_ACCEPT_BEST')
  @Transform(({ value }) =>
    ['inf', 'infinity'].includes(value?.toLowerCase())
      ? Infinity
      : parseInt(value, 10),
  )
  readonly acceptBest = 14;

  @ProcessEnv('HEARTBEAT_BEST_MULTIPLIER')
  @Transform(({ value }) => parseInt(value, 10))
  readonly bestMultiplier = 0.9;

  @ProcessEnv('STREAM_LONG_CYCLE')
  @Transform(({ value }) => parseInt(value, 10) * 1000)
  readonly longCycle = 5 * 60 * 1000;

  @ProcessEnv('STREAM_DEBUG')
  @BoolTransform()
  readonly debug = false;
}
