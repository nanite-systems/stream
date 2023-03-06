import { Observable } from 'rxjs';
import { IntelligenceCommands } from './constants';
import { RecentCharacters, ServiceStates } from './concerns/response.types';
import { ClientProxy } from '@nestjs/microservices';

export interface Client {
  send(
    pattern: IntelligenceCommands.recentCharacters,
    data: { environment: string },
  ): Observable<RecentCharacters>;

  send(
    pattern: IntelligenceCommands.recentCharacterCount,
    data: { environment: string },
  ): Observable<RecentCharacters>;

  send(
    pattern: IntelligenceCommands.serviceStates,
    data: Record<string, never>,
  ): Observable<ServiceStates>;
}

declare function test(client: Client): void;

declare const opt: ClientProxy;
test(opt);
