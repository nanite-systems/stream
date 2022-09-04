import { Injectable } from '@nestjs/common';
import { WorldState } from '../concerns/world-state';

@Injectable()
export class WorldTracker {
  private readonly states = new Map<string, WorldState>();

  register(worldState: WorldState): boolean {
    const { worldId, state } = worldState;
    if (this.states.get(worldId)?.state === state) return false;

    this.states.set(worldId, worldState);

    return true;
  }

  toArray(): WorldState[] {
    return Array.from(this.states.values());
  }
}
