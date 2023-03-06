interface DuplicateEntry {
  timestamp: number;
  uniqueness: number;
}

export class DuplicateService {
  private readonly cache = new Map<string, DuplicateEntry>();

  private isCleaning = false;

  constructor(private readonly expire: number) {}

  checkAndIncr(hash: string): number {
    let entry = this.cache.get(hash);

    if (entry) {
      entry.uniqueness++;
    } else {
      entry = {
        timestamp: Date.now(),
        uniqueness: 0,
      };
      this.cache.set(hash, entry);
    }

    this.cleanup();

    return entry.uniqueness;
  }

  private cleanup(): void {
    if (this.isCleaning) return;
    this.isCleaning = true;

    process.nextTick(() => {
      const now = Date.now();
      for (const [hash, entry] of this.cache) {
        const age = now - entry.timestamp;
        if (age < this.expire) break;

        this.cache.delete(hash);
      }

      this.isCleaning = false;
    });
  }
}
