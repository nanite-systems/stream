import { Stream } from 'ps2census';

export type EventPayload = Stream.PS2Event;

export interface ServiceState {
  worldId: string;
  worldName: string;
  detail: string;
  online: boolean;
}
