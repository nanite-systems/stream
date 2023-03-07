import { Observable } from 'rxjs';
import { EventPayload, ServiceState } from '@nss/ess-concerns';

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

  observeServiceState(): Observable<ServiceState>;

  observeEventMessage(): Observable<EventPayload>;

  observeDisconnect<T = any>(): Observable<T>;
}
