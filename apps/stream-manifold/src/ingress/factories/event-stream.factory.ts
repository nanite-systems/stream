import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { Stream } from 'ps2census';
import { Ps2EventMessage } from '../../subscription/concerns/event-message.types';

@Injectable()
export class EventStreamFactory {
  private readonly cache = new Map<string, Subject<Ps2EventMessage>>();

  get<Event extends Ps2EventMessage>(
    worldId: string,
    eventName: Event['event_name'],
  ): Subject<Event> {
    const key = `${worldId}:${eventName};`;

    if (this.cache.has(key)) return this.cache.get(key) as any;

    const subject = new Subject<Stream.PS2Event>();

    this.cache.set(key, subject);

    return subject as any;
  }
}
