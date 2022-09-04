import { Stream } from 'ps2census';

export interface EventMessage {
  collector: string;
  environment: string;
  worldId: string;
  eventName: Stream.PS2EventNames;
  payload: Stream.PS2Event;
}
