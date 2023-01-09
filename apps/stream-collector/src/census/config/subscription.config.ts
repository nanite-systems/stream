import { BoolTransform, ProcessEnv } from '@nss/utils';
import { Stream } from 'ps2census';
import { Transform } from 'class-transformer';

type EventNames = Stream.CensusCommands.Subscribe['eventNames'];

export class SubscriptionConfig {
  @ProcessEnv('SUBSCRIPTION_WORLDS')
  @Transform(({ value }) => value.split(','))
  worlds = ['all'];

  @ProcessEnv('SUBSCRIPTION_EVENTS')
  @Transform(({ value }) => value.split(','))
  events: EventNames = ['all'];

  @ProcessEnv('SUBSCRIPTION_LOGICAL_AND')
  @BoolTransform()
  logicalAnd = true;
}
