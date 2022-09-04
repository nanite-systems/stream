import { EnvironmentDescription } from './utils/environment.description';

export class EnvironmentManifest {
  static readonly defaultEnvironment = 'ps2';

  static readonly environments: Record<string, EnvironmentDescription> = {
    ps2: new EnvironmentDescription(['1', '10', '13', '17', '19', '40']),
    ps2ps4eu: new EnvironmentDescription(['2000']),
    ps2ps4us: new EnvironmentDescription(['1000']),
  };

  static validateEnvironmentKey(key: string): boolean {
    return Object.keys(this.environments).includes(key);
  }
}
