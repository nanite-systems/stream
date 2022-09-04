interface Wrapper<T> {
  value: T;
  expireAt: number;
}

export class DecayingMap<K, V> {
  private readonly map = new Map<K, Wrapper<V>>();

  constructor(private readonly decay: number, pruneInterval: number) {
    setInterval(() => {
      this.prune();
    }, pruneInterval).unref();
  }

  set(key: K, value: V, decay?: number): void {
    const wrapper: Wrapper<V> = {
      value,
      expireAt: Date.now() + (decay ?? this.decay),
    };

    this.map.set(key, wrapper);
  }

  has(key: K): boolean {
    return Boolean(this.get(key));
  }

  get(key: K): V | undefined {
    const item = this.map.get(key);

    if (!item) return undefined;

    const { value, expireAt } = item;

    if (expireAt > Date.now()) return value;

    this.delete(key);
  }

  delete(key: K): void {
    this.map.delete(key);
  }

  clear(): void {
    this.map.clear();
  }

  refresh(key: K, decay?: number): boolean {
    const value = this.get(key);

    if (value) this.set(key, value, decay);

    return Boolean(value);
  }

  private prune(): void {
    const time = Date.now();
    for (const [key, { expireAt }] of this.map) {
      if (expireAt <= time) this.delete(key);
    }
  }
}
