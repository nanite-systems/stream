import { Inject, Injectable } from '@nestjs/common';
import {
  HEARTBEAT_OFFSET_ACCESSOR,
  HeartbeatOffsetAccessorContract,
} from '../concerns/heartbeat-offset-accessor.contract';

export const CONDUCTOR_OPTIONS = Symbol('provide:conductor_options');

export interface StreamConductorServiceOptions {
  minAcceptedOffsetThreshold: number;
}

@Injectable()
export class StreamConductorService {
  private readonly accepted = new Map<any, number>();

  constructor(
    @Inject(HEARTBEAT_OFFSET_ACCESSOR)
    private readonly offsetAccessor: HeartbeatOffsetAccessorContract,
    @Inject(CONDUCTOR_OPTIONS)
    private readonly options: StreamConductorServiceOptions,
  ) {}

  claim(connection: any, offset: number): boolean {
    for (const [, accepted] of this.accepted) {
      const delta = this.offsetAccessor.deltaOffsets(accepted, offset);
      if (delta <= this.options.minAcceptedOffsetThreshold) return false;
    }

    this.accepted.set(connection, offset);
    return true;
  }

  release(connection: any): void {
    this.accepted.delete(connection);
  }
}
