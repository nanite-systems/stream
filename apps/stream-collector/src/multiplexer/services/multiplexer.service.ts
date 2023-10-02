import { Inject, Injectable } from '@nestjs/common';
import { DETAILED_CONNECTIONS } from '../../census/constants';
import { filter, from, map, mergeMap, Observable, share } from 'rxjs';
import { EventEntity } from '../entities/event.entity';
import { EventEntityFactory } from '../factories/event-entity.factory';
import { DetailedConnectionContract } from '../../census/concerns/detailed-connection.contract';

@Injectable()
export class MultiplexerService {
  private readonly streamObservable: Observable<EventEntity>;

  private readonly duplicateObservable: Observable<EventEntity>;

  constructor(
    @Inject(DETAILED_CONNECTIONS)
    private readonly connections: DetailedConnectionContract[],
    private readonly eventEntityFactory: EventEntityFactory,
  ) {
    const messages = from(this.connections).pipe(
      mergeMap(({ details, connection }) =>
        connection
          .observeEventMessage()
          .pipe(
            map((payload) => this.eventEntityFactory.create(payload, details)),
          ),
      ),
      share(),
    );

    this.streamObservable = messages.pipe(
      filter(
        (event) =>
          event.sightingMultiplexed == 0 && event.sightingConnection == 0,
      ),
      share(),
    );

    this.duplicateObservable = messages.pipe(
      filter((event) => event.sightingConnection > 0),
      share(),
    );
  }

  observeStream(): Observable<EventEntity> {
    return this.streamObservable;
  }

  observeDuplicates(): Observable<EventEntity> {
    return this.duplicateObservable;
  }
}
