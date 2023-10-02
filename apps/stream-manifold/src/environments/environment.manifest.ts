import { EnvironmentDescription } from './utils/environment.description';
import { Environments } from '@nss/ess-concerns';

export class EnvironmentManifest {
  static readonly defaultEnvironment = Environments.PC;

  static readonly environments: Record<Environments, EnvironmentDescription> = {
    [Environments.PC]: new EnvironmentDescription([
      '1',
      '10',
      '13',
      '17',
      '19',
      '40',
    ]),
    [Environments.PS4EU]: new EnvironmentDescription(['2000']),
    [Environments.PS4US]: new EnvironmentDescription(['1000']),
    [Environments.ALL]: new EnvironmentDescription([
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

  static validateEnvironmentKey(key: Environments): boolean {
    return Object.keys(this.environments).includes(key);
  }
}
