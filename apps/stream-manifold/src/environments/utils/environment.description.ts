export class EnvironmentDescription {
  private readonly _worlds: Set<string>;

  constructor(worlds: string[]) {
    this._worlds = new Set(worlds);
  }

  get worlds(): Iterable<string> {
    return this._worlds[Symbol.iterator]();
  }

  hasWorld(world: string): boolean {
    return this._worlds.has(world);
  }
}
