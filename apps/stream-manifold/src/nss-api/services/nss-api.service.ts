import { Inject, Injectable } from '@nestjs/common';
import { NSS_API_CLIENT } from '../constants';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiCommands,
  RecentCharacterCountResponse,
  RecentCharactersResponse,
  ServiceStatesResponse,
} from '@nss/ess-concerns';
import { Observable } from 'rxjs';

@Injectable()
export class NssApiService {
  constructor(@Inject(NSS_API_CLIENT) private readonly api: ClientProxy) {}

  recentCharacters(environment: string): Observable<RecentCharactersResponse> {
    return this.api.send(ApiCommands.recentCharacters, { environment });
  }

  recentCharacterCount(
    environment: string,
  ): Observable<RecentCharacterCountResponse> {
    return this.api.send(ApiCommands.recentCharacterCount, { environment });
  }

  serviceStates(): Observable<ServiceStatesResponse> {
    return this.api.send(ApiCommands.serviceStates, {});
  }
}
