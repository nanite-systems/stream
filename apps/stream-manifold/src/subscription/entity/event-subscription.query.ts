import { SubscribeDto } from '../../stream/dtos/subscribe.dto';
import { Injectable, Scope } from '@nestjs/common';
import { EventEmitter } from 'eventemitter3';
import { Stream } from 'ps2census';

type EventSubscriptionQueryEvents = {
  subscribe: () => void;
  unsubscribe: () => void;
  unsubscribeAll: () => void;
};

@Injectable({ scope: Scope.REQUEST })
export class EventSubscriptionQuery extends EventEmitter<EventSubscriptionQueryEvents> {
  private readonly _worlds = new Set<string>();

  private readonly _characters = new Set<string>();

  private readonly _events = new Set<string>();

  private _logicalAndCharactersWithWorlds = false;

  get worlds(): string[] {
    return Array.from(this._worlds);
  }

  get noWorlds(): number {
    return this._worlds.size;
  }

  hasWorld(world: string): boolean {
    return this._worlds.has('all') || this._worlds.has(world);
  }

  get characters(): string[] {
    return Array.from(this._characters);
  }

  get noCharacters(): number {
    return this._characters.size;
  }

  hasCharacter(character: string): boolean {
    return this._characters.has('all') || this._characters.has(character);
  }

  get events(): string[] {
    return Array.from(this._events);
  }

  get noEvents(): number {
    return this._events.size;
  }

  hasEvent(event: string): boolean {
    return this._events.has('all') || this._events.has(event);
  }

  get logicalAndCharactersWithWorlds(): boolean {
    return this._logicalAndCharactersWithWorlds;
  }

  merge(subscribe: SubscribeDto): void {
    subscribe.eventNames?.forEach((event) => {
      this._events.add(event);
    });
    subscribe.worlds?.forEach((world) => {
      this._worlds.add(world);
    });
    subscribe.characters?.forEach((character) => {
      this._characters.add(character);
    });

    this._logicalAndCharactersWithWorlds =
      subscribe.logicalAndCharactersWithWorlds ??
      this._logicalAndCharactersWithWorlds;

    this.emit('subscribe');
  }

  clear(subscribe: SubscribeDto): void {
    subscribe.eventNames?.forEach((event) => {
      this._events.delete(event);
    });
    subscribe.worlds?.forEach((world) => {
      this._worlds.delete(world);
    });
    subscribe.characters?.forEach((character) => {
      this._characters.delete(character);
    });

    this._logicalAndCharactersWithWorlds =
      subscribe.logicalAndCharactersWithWorlds ??
      this._logicalAndCharactersWithWorlds;

    this.emit('unsubscribe');
  }

  clearAll(): void {
    this._worlds.clear();
    this._characters.clear();
    this._events.clear();

    this._logicalAndCharactersWithWorlds = false;

    this.emit('unsubscribeAll');
  }

  format(listCharacters = false): Stream.CensusMessages.Subscription {
    if (this._characters.has('all') || listCharacters)
      return {
        subscription: {
          characters: ['all'],
          eventNames: Array.from(this._events) as any,
          logicalAndCharactersWithWorlds: this._logicalAndCharactersWithWorlds,
          worlds: Array.from(this._worlds),
        },
      };

    return {
      subscription: {
        characterCount: this._characters.size,
        eventNames: Array.from(this._events) as any,
        logicalAndCharactersWithWorlds: this._logicalAndCharactersWithWorlds,
        worlds: Array.from(this._worlds),
      },
    };
  }
}
