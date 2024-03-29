import { map, merge, Observable, of, timer } from 'rxjs';
import { Injectable, Scope } from '@nestjs/common';
import { FactoryInterface } from '../../utils/factory.interface';
import { Environment } from '../../environments/utils/environment';
import { Stream } from 'ps2census';
import { ServiceState } from '@nss/ess-concerns';

@Injectable({ scope: Scope.REQUEST })
export class BaseStreamFactory implements FactoryInterface<Observable<any>> {
  constructor(private readonly environment: Environment) {}

  create(): Observable<Stream.CensusMessageWithoutEcho> {
    return merge(
      this.connectionState(),
      this.sendHelp(),
      this.heartbeat(),
      this.serviceState(),
    );
  }

  private connectionState(): Observable<Stream.CensusMessages.ConnectionStateChanged> {
    return of({
      connected: 'true',
      service: 'push',
      type: 'connectionStateChanged',
    });
  }

  public sendHelp(): Observable<Stream.CensusMessages.Help> {
    return of({ 'send this for help': { service: 'event', action: 'help' } });
  }

  public heartbeat(): Observable<Stream.CensusMessages.Heartbeat> {
    return timer(5000, 30000).pipe(
      map(() => ({
        online: Object.fromEntries(
          this.environment
            .getServiceStates()
            .map((state) => [
              this.createDetail(state),
              state.online ? 'true' : 'false',
            ]),
        ),
        timestamp: Math.floor(new Date().getTime() / 1000).toString(10),
        service: 'event',
        type: 'heartbeat',
      })),
    );
  }

  public serviceState(): Observable<Stream.CensusMessages.ServiceStateChanged> {
    return this.environment.serviceStateStream.pipe(
      map((state) => ({
        detail: this.createDetail(state),
        online: state.online ? 'true' : 'false',
        service: 'event',
        type: 'serviceStateChanged',
      })),
    );
  }

  private createDetail(state: ServiceState): string {
    const { worldId, worldName } = state;
    return `EventServerEndpoint_${worldName}_${worldId}`;
  }
}
