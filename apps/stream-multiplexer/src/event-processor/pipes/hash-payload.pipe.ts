import { Injectable } from '@nestjs/common';
import { EventMessage } from '../concerns/stream-messages.types';
import { Stream } from 'ps2census';

export interface HashedEventMessage extends EventMessage {
  hash: string;
}

@Injectable()
export class HashPayloadPipe {
  handle(event: EventMessage): HashedEventMessage {
    return {
      ...event,
      hash: this.createHash(event.payload),
    };
  }

  private createHash(payload: Stream.PS2Event): string {
    let hash = '';

    for (const key in payload) hash += `:${payload[key]}`;

    return hash.slice(1);
  }
}
