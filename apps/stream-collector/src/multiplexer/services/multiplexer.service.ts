import { Inject, Injectable } from '@nestjs/common';
import { CONNECTIONS } from '../../census/constants';
import { ConnectionContract } from '../../census/concerns/connection.contract';
import {
  filter,
  from,
  map,
  mergeMap,
  Observable,
  partition,
  share,
} from 'rxjs';
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
    const [stream, residualStream] = partition(
      from(connections).pipe(
        mergeMap((connection) =>
          connection
            .observeEventMessage()
            .pipe(
              map((payload) =>
                this.eventEntityFactory.create(payload, connection),
              ),
            ),
        ),
      ),
      (event) =>
        event.sightingMultiplexed == 0 && event.sightingConnection == 0,
    );

    this.streamObservable = stream.pipe(share());
    this.duplicateObservable = residualStream.pipe(
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
