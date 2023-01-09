import { Injectable } from '@nestjs/common';
import { DecayingSet } from '../utils/decaying-set';

@Injectable()
export class DuplicateFilter {
  private readonly cache = new DecayingSet<string>(30 * 1000, 60 * 1000);

  filter(hash: string): boolean {
    if (this.cache.has(hash)) return false;

    this.cache.add(hash);

    return true;
  }
}
