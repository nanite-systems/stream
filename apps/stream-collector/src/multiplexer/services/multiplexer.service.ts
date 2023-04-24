import { Inject, Injectable } from '@nestjs/common';
import { CONNECTIONS } from '../../census/constants';
import { ConnectionContract } from '../../census/concerns/connection.contract';
import { filter, from, map, mergeMap, Observable, share } from 'rxjs';
import { EventEntity } from '../entities/event.entity';
import { EventEntityFactory } from '../factories/event-entity.factory';

@Injectable()
export class MultiplexerService {
  private readonly streamObservable: Observable<EventEntity>;

  private readonly duplicateObservable: Observable<EventEntity>;

  constructor(
    @Inject(CONNECTIONS) private readonly connections: ConnectionContract[],
    private readonly eventEntityFactory: EventEntityFactory,
  ) {
    const messages = from(connections).pipe(
      mergeMap((connection) =>
        connection
          .observeEventMessage()
          .pipe(
            map((payload) =>
              this.eventEntityFactory.create(payload, connection),
            ),
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
