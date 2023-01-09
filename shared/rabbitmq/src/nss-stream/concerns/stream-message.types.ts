import { Stream } from 'ps2census';
import { ServiceState } from '../../concerns/service-state.type';

export type Event = Stream.PS2Event;
export { ServiceState };

export type Union = Event | ServiceState;
