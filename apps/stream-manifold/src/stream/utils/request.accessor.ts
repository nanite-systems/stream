import { Inject, Injectable } from '@nestjs/common';
import { IncomingMessage } from 'http';

export const CONNECTION_ACCESSOR_OPTIONS = Symbol(
  'provide:connection_accessor_options',
);

export interface ConnectionAccessorOptions {
  behindProxy: boolean;
  tokenHeader: string;
}

@Injectable()
export class RequestAccessor {
  constructor(
    @Inject(CONNECTION_ACCESSOR_OPTIONS)
    private readonly options: ConnectionAccessorOptions,
  ) {}

  getIpAddresses(request: IncomingMessage): string[] {
    if (this.options.behindProxy)
      return [request.headers['x-forwarded-for']].flat();

    return [request.socket.remoteAddress];
  }

  getToken(request: IncomingMessage): string {
    return [request.headers[this.options.tokenHeader]].flat()[0];
  }
}
