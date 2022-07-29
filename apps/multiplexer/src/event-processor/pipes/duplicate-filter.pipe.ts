import { Injectable } from '@nestjs/common';
import { DecayingMap } from '../utils/decaying-map';
import { DecayingSet } from '../utils/decaying-set';
import { MINUTE, SECOND } from '../../utils/time.constants';
import { HashedEventMessage } from './hash-payload.pipe';

@Injectable()
export class DuplicateFilterPipe {
  private readonly map = new DecayingMap<string, DecayingSet<string>>(
    15 * MINUTE,
    5 * MINUTE,
  );

  handle(event: HashedEventMessage): boolean {
    const hashSet = this.getHashSet(event.collector);

    if (event.eventName == 'GainExperience') return true;
    if (hashSet.has(event.hash)) return false;

    hashSet.add(event.hash);

    return true;
  }

  private getHashSet(key: string): DecayingSet<string> {
    let hashSet = this.map.get(key);

    if (hashSet) {
      this.map.refresh(key);

      return hashSet;
    }

    hashSet = new DecayingSet<string>(30 * SECOND, 6 * MINUTE);
    this.map.set(key, hashSet);

    return hashSet;
  }
}
