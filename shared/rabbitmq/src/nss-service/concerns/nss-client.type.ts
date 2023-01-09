import { Observable } from 'rxjs';
import { NSS_COMMANDS } from '../constants';
import {
  RecentCharacterCountRes,
  RecentCharactersRes,
  ServiceStateRes,
} from './nss-commands.types';

export interface NssClient {
  send(command: NSS_COMMANDS.recentCharacters): Observable<RecentCharactersRes>;

  send(
    command: NSS_COMMANDS.recentCharacterCount,
  ): Observable<RecentCharacterCountRes>;

  send(command: NSS_COMMANDS.serviceStates): Observable<ServiceStateRes>;
}
