import { ProcessEnv } from '@nanite-systems/utils';

export class CensusConfig {
  @ProcessEnv('SERVICE_ID')
  serviceId: string;
}
