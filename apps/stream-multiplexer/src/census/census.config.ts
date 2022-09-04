import { ProcessEnv } from '@census-reworked/nestjs-utils';
import { IsNotEmpty } from 'class-validator';

export class CensusConfig {
  @ProcessEnv('SERVICE_ID')
  @IsNotEmpty()
  serviceId: string;
}
