export const HEARTBEAT_OFFSET_ACCESSOR = Symbol(
  'provide:heartbeat_offset_accessor',
);

export interface HeartbeatOffsetAccessorContract {
  timestampToOffset(ts: number): number;
  deltaOffsets(a: number, b: number): number;
}
