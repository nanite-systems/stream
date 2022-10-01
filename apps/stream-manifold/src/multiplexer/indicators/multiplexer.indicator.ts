import { HttpHealthIndicator } from '@nestjs/terminus';
import { MultiplexerConfig } from '../multiplexer.config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MultiplexerIndicator {
  constructor(
    private readonly http: HttpHealthIndicator,
    private readonly config: MultiplexerConfig,
  ) {}

  check(key: string) {
    return this.http.pingCheck(key, `${this.config.endpoint}/health`);
  }
}
