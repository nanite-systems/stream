import { Inject, Injectable, Scope } from '@nestjs/common';
import { WS_REQUEST } from '../constants';
import { IncomingMessage } from 'http';

@Injectable({ scope: Scope.REQUEST })
export class ConnectionSettings {
  constructor(@Inject(WS_REQUEST) private readonly request: IncomingMessage) {}

  get environment(): string {
    const params = new URLSearchParams(
      this.request.url.match(/(?<=\?).*/).shift(),
    );

    return params.get('environment') ?? 'ps2';
  }
}
