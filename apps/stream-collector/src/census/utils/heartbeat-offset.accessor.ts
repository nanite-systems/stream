import { HeartbeatOffsetAccessorContract } from '../concerns/heartbeat-offset-accessor.contract';
import { Inject } from '@nestjs/common';

export const HEARTBEAT_OFFSET_ACCESSOR_OPTIONS = Symbol(
  'provide:heartbeat_offset_accessor_options',
);

export interface HeartbeatOffsetAccessorOptions {
  heartbeatInterval: number;
}

export class HeartbeatOffsetAccessor
  implements HeartbeatOffsetAccessorContract
{
  private readonly half: number;

  constructor(
    @Inject(HEARTBEAT_OFFSET_ACCESSOR_OPTIONS)
    private readonly options: HeartbeatOffsetAccessorOptions,
  ) {
    this.half = Math.floor(this.options.heartbeatInterval / 2);
  }

  timestampToOffset(ts: number): number {
    return ts % this.options.heartbeatInterval;
  }

  deltaOffsets(a: number, b: number): number {
    return this.half - Math.abs(this.half - Math.abs(a - b));
  }
}
