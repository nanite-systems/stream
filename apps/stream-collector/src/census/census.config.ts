import { PS2Environment, Stream } from 'ps2census';
import { Transform } from 'class-transformer';
import { ProcessEnv, BoolTransform } from '@nanite-systems/utils';

type EventNames = Stream.CensusCommands.Subscribe['eventNames'];

export class CensusConfig {
  @ProcessEnv('SERVICE_ID')
  serviceId;

  @ProcessEnv('PS2_ENVIRONMENT')
  environment: PS2Environment;

  @ProcessEnv('STREAM_ENDPOINT')
  endpoint?: string;

  @ProcessEnv('RESUBSCRIBE_INTERVAL')
  @Transform(({ value }) => Number.parseInt(value, 10) * 1000)
  resubscribeInterval?: number;

  @ProcessEnv('RECONNECT_INTERVAL')
  @Transform(({ value }) => Number.parseInt(value, 10) * 1000)
  reconnectInterval?: number;

  @ProcessEnv('RECONNECT_DELAY_FAULT')
  @Transform(({ value }) => Number.parseInt(value, 10) * 1000)
  reconnectDelayFault = 5000;

  @ProcessEnv('RECONNECT_DELAY')
  @Transform(({ value }) => Number.parseInt(value, 10) * 1000)
  reconnectDelay = 0;

  @ProcessEnv('SUBSCRIBE_WORLDS')
  @Transform(({ value }) => value.split(','))
  worlds: string[] = ['all'];

  @ProcessEnv('SUBSCRIBE_EVENTS')
  @Transform(({ value }) => value.split(','))
  events: EventNames = ['all'];

  @ProcessEnv('SUBSCRIBE_LOGICAL_AND')
  @BoolTransform()
  logicalAnd = false;
}
