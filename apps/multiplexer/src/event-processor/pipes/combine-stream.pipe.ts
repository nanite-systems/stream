import { Injectable } from '@nestjs/common';
import { DecayingMap } from '../utils/decaying-map';
import { MINUTE, SECOND } from '../../utils/time.constants';
import { HashedEventMessage } from './hash-payload.pipe';
import { Counters } from '../utils/counters';

@Injectable()
export class CombineStreamPipe {
  private readonly map = new DecayingMap<string, Counters>(
    30 * SECOND,
    3 * MINUTE,
  );

  handle(event: HashedEventMessage): boolean {
    const counters = this.getCounters(event.hash);
    const currentMax = counters.max;
    const hits = counters.hit(event.collector);

    return hits > currentMax;
  }

  private getCounters(key: string): Counters {
    let counters = this.map.get(key);

    if (!counters) {
      counters = new Counters();
      this.map.set(key, counters);
    }

    return counters;
  }
}
