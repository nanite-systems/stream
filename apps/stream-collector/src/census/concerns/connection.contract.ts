import { Observable } from 'rxjs';
import { EventPayload } from './event-payload.type';

export interface ConnectionContract {
  connect(): Observable<void>;

  disconnect(): void;

  subscribe(subscription: {
    characters?: string[];
    eventNames?: string[];
    worlds?: string[];
    logicalAndCharactersWithWorlds?: boolean;
  }): void;

  observeConnect(): Observable<void>;

  observeHeartbeat(): Observable<void>;

  observeEventMessage(): Observable<EventPayload>;

  observeDisconnect<T = any>(): Observable<T>;
}
