import { ProcessEnv } from '@nss/utils';

export class CensusConfig {
  @ProcessEnv('CENSUS_SERVICE_ID')
  readonly serviceId: string;

  @ProcessEnv('CENSUS_ESS_URL')
  readonly connectionURL = 'wss://push.nanite-systems.net/streaming';
}
