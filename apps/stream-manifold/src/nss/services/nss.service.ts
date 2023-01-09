import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { EnvironmentName } from '../../concerns/environment.type';
import {
  NSS_COMMANDS,
  NSS_PS2_CLIENT,
  NSS_PS2PS4EU_CLIENT,
  NSS_PS2PS4US_CLIENT,
  NssClient,
  ServiceState,
} from '@nss/rabbitmq';
import { NssCombinedClient } from './nss-combined.client';

@Injectable()
export class NssService {
  constructor(
    @Inject(NSS_PS2_CLIENT) private readonly pc: NssClient,
    @Inject(NSS_PS2PS4EU_CLIENT) private readonly ps4eu: NssClient,
    @Inject(NSS_PS2PS4US_CLIENT) private readonly ps4us: NssClient,
    private readonly all: NssCombinedClient,
  ) {}

  async getServiceStates(
    environment: EnvironmentName,
  ): Promise<ServiceState[]> {
    return firstValueFrom(
      this.service(environment).send(NSS_COMMANDS.serviceStates),
    );
  }

  async getRecentCharactersIds(
    environment: EnvironmentName,
  ): Promise<string[]> {
    return firstValueFrom(
      this.service(environment).send(NSS_COMMANDS.recentCharacters),
    );
  }

  async getRecentCharactersCount(
    environment: EnvironmentName,
  ): Promise<number> {
    return firstValueFrom(
      this.service(environment).send(NSS_COMMANDS.recentCharacterCount),
    );
  }

  private service(environment: EnvironmentName) {
    switch (environment) {
      case 'ps2':
        return this.pc;
      case 'ps2ps4eu':
        return this.ps4eu;
      case 'ps2ps4us':
        return this.ps4us;
      case 'all':
        return this.all;
    }
  }
}
