import { ServiceState } from './service-state.type';

export class ServiceStateTracker {
  private readonly cache = new Map<string, ServiceState>();

  register(state: ServiceState): boolean {
    const world = state.worldId;
    const prev = this.cache.get(world);

    if (prev && state.online == prev.online) {
      return false;
    }

    this.cache.set(world, state);

    return true;
  }

  states(): ServiceState[] {
    return Array.from(this.cache.values());
  }
}
