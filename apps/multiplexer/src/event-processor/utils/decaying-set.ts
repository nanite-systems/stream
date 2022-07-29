export class DecayingSet<T> {
  private readonly cache = new Map<T, number>();

  constructor(private readonly decay: number, pruneInterval: number) {
    setInterval(() => {
      this.prune();
    }, pruneInterval).unref();
  }

  has(value: T): boolean {
    const expireAt = this.cache.get(value);

    if (expireAt && expireAt > Date.now()) return true;

    this.cache.delete(value);
    return false;
  }

  add(value: T, decay?: number): void {
    this.cache.set(value, Date.now() + (decay ?? this.decay));
  }

  delete(value: T): void {
    this.cache.delete(value);
  }

  clear(): void {
    this.cache.clear();
  }

  private prune(): void {
    const time = Date.now();
    for (const [value, expireAt] of this.cache) {
      if (expireAt <= time) this.delete(value);
    }
  }
}
