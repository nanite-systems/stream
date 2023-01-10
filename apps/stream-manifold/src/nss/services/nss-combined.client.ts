import {
  NSS_COMMANDS,
  NSS_PS2_CLIENT,
  NSS_PS2PS4EU_CLIENT,
  NSS_PS2PS4US_CLIENT,
  NssClient,
  NssCommandResponses,
} from '@nss/rabbitmq';
import { first, from, mergeMap, Observable } from 'rxjs';
import { Inject } from '@nestjs/common';
import { reduce } from 'rxjs/operators';

export class NssCombinedClient implements NssClient {
  private readonly clients: NssClient[];

  constructor(
    @Inject(NSS_PS2_CLIENT) pc: NssClient,
    @Inject(NSS_PS2PS4EU_CLIENT) ps4eu: NssClient,
    @Inject(NSS_PS2PS4US_CLIENT) ps4us: NssClient,
  ) {
    this.clients = [pc, ps4eu, ps4us];
  }

  send(
    command: NSS_COMMANDS.recentCharacters,
  ): Observable<NssCommandResponses.RecentCharactersRes>;
  send(
    command: NSS_COMMANDS.recentCharacterCount,
  ): Observable<NssCommandResponses.RecentCharacterCountRes>;
  send(
    command: NSS_COMMANDS.serviceStates,
  ): Observable<NssCommandResponses.ServiceStateRes>;
  send(command: any): Observable<any> {
    const meep: Observable<any> = from(this.clients).pipe(
      mergeMap((client) => client.send(command, {}).pipe(first())),
    );

    switch (command) {
      case NSS_COMMANDS.recentCharacters:
      case NSS_COMMANDS.serviceStates:
        return meep.pipe(reduce((a, r) => [...a, ...r], []));
      case NSS_COMMANDS.recentCharacterCount:
        return meep.pipe(reduce((a, r) => a + r, 0));
    }
  }
}
