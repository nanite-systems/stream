export class Counters {
  private _max = 0;

  private readonly map: Record<string, number> = {};

  hit(key: string, times = 1): number {
    const hits = this.map[key]
      ? (this.map[key] += times)
      : (this.map[key] = times);

    if (hits > this._max) this._max = hits;

    return hits;
  }

  get max(): number {
    return this._max;
  }
}
