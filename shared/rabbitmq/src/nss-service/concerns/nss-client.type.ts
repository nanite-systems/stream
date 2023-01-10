import { Observable } from 'rxjs';
import { NSS_COMMANDS } from '../constants';
import {
  RecentCharacterCountRes,
  RecentCharactersRes,
  ServiceStateRes,
} from './nss-commands.types';

export interface NssClient {
  send(
    command: NSS_COMMANDS.recentCharacters,
    data: {},
  ): Observable<RecentCharactersRes>;

  send(
    command: NSS_COMMANDS.recentCharacterCount,
    data: {},
  ): Observable<RecentCharacterCountRes>;

  send(
    command: NSS_COMMANDS.serviceStates,
    data: {},
  ): Observable<ServiceStateRes>;
}
