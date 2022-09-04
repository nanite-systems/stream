import { ProcessEnv } from '@census-reworked/nestjs-utils';
import {
  ArrayUnique,
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  Min,
} from 'class-validator';
import { PS2Environment, Stream } from 'ps2census';
import { Transform } from 'class-transformer';
import { BoolTransform } from '../utils/transformers.decorators';

const EventNames: Stream.CensusCommands.Subscribe['eventNames'] = [
  'all',
  'AchievementEarned',
  'BattleRankUp',
  'ContinentLock',
  'ContinentUnlock',
  'Death',
  'FacilityControl',
  'GainExperience',
  'ItemAdded',
  'MetagameEvent',
  'PlayerFacilityCapture',
  'PlayerFacilityDefend',
  'PlayerLogin',
  'PlayerLogout',
  'SkillAdded',
  'VehicleDestroy',
];

export class CensusConfig {
  @ProcessEnv('SERVICE_ID')
  @IsNotEmpty()
  serviceId;

  @ProcessEnv('PS2_ENVIRONMENT')
  @IsIn(['ps2', 'ps2ps4eu', 'ps2ps4us'])
  environment: PS2Environment;

  @ProcessEnv('STREAM_ENDPOINT')
  @IsOptional()
  @IsUrl({ protocols: ['wss', 'ws'], require_tld: false })
  endpoint?: string;

  @ProcessEnv('RESUBSCRIBE_INTERVAL')
  @IsOptional()
  @IsInt()
  @Min(1000)
  @Transform(({ value }) => Number.parseInt(value, 10) * 1000)
  resubscribeInterval?: number;

  @ProcessEnv('RECONNECT_INTERVAL')
  @IsOptional()
  @IsInt()
  @Min(1000)
  @Transform(({ value }) => Number.parseInt(value, 10) * 1000)
  reconnectInterval?: number;

  @ProcessEnv('RECONNECT_DELAY_FAULT')
  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform(({ value }) => Number.parseInt(value, 10) * 1000)
  reconnectDelayFault = 5000;

  @ProcessEnv('RECONNECT_DELAY')
  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform(({ value }) => Number.parseInt(value, 10) * 1000)
  reconnectDelay = 0;

  @ProcessEnv('SUBSCRIBE_WORLDS')
  @Transform(({ value }) => value.split(','))
  worlds: string[] = ['all'];

  @ProcessEnv('SUBSCRIBE_EVENTS')
  @IsIn(EventNames, {
    each: true,
  })
  @ArrayUnique()
  @Transform(({ value }) => value.split(','))
  events: Stream.CensusCommands.Subscribe['eventNames'] = ['all'];

  @ProcessEnv('SUBSCRIBE_LOGICAL_AND')
  @IsBoolean()
  @BoolTransform()
  logicalAnd = false;
}
