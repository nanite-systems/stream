import { Injectable } from '@nestjs/common';
import { Counters } from '../utils/counters';
import { DecayingMap } from '../utils/decaying-map';

@Injectable({})
export class MultiplexStreamFilter {
  private readonly map = new DecayingMap<string, Counters>(
    30 * 1000,
    60 * 1000,
  );

  filter(hash: string, collector: string): boolean {
    const counters = this.getCounters(hash);
    const hits = counters.hit(collector);

    return hits > counters.max;
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
