import { EnvironmentDescription } from './utils/environment.description';
import { EnvironmentName } from '../concerns/environment.type';

export class EnvironmentManifest {
  static readonly defaultEnvironment: EnvironmentName = 'ps2';

  static readonly environments: Record<
    EnvironmentName,
    EnvironmentDescription
  > = {
    ps2: new EnvironmentDescription(['1', '10', '13', '17', '19', '40']),
    ps2ps4eu: new EnvironmentDescription(['2000']),
    ps2ps4us: new EnvironmentDescription(['1000']),
    all: new EnvironmentDescription([
      '1',
      '10',
      '13',
      '17',
      '19',
      '40',
      '1000',
      '2000',
    ]),
  };

  static validateEnvironmentKey(key: EnvironmentName): boolean {
    return Object.keys(this.environments).includes(key);
  }
}
