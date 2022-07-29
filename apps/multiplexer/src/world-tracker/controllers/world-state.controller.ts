import { Controller, Get } from '@nestjs/common';
import { WorldTracker } from '../trackers/world.tracker';
import { WorldState } from '../concerns/world-state';

@Controller('/world-states')
export class WorldStateController {
  constructor(private readonly worldTracker: WorldTracker) {}

  @Get()
  worldStates(): WorldState[] {
    return this.worldTracker.toArray();
  }
}
