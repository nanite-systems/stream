export const HEARTBEAT_OFFSET_ACCESSOR = Symbol(
  'provide:heartbeat_offset_accessor',
);

export interface HeartbeatOffsetAccessorContract {
  getOffset(): number;

  deltaOffsets(a: number, b: number): number;
}
