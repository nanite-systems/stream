import { Inject, Injectable } from '@nestjs/common';
import { EnvironmentName } from '../../concerns/environment.type';
import {
  NSS_PS2_CLIENT,
  NSS_PS2PS4EU_CLIENT,
  NSS_PS2PS4US_CLIENT,
  NssClient,
} from '@nss/rabbitmq';
import { NssCombinedClient } from './nss-combined.client';

@Injectable()
export class NssServiceContainer {
  constructor(
    @Inject(NSS_PS2_CLIENT) private readonly pc: NssClient,
    @Inject(NSS_PS2PS4EU_CLIENT) private readonly ps4eu: NssClient,
    @Inject(NSS_PS2PS4US_CLIENT) private readonly ps4us: NssClient,
    private readonly all: NssCombinedClient,
  ) {}

  getService(environment: EnvironmentName): NssClient {
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
