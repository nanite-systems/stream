import { Stream } from 'ps2census';

export type Ps2EventMessage = Stream.PS2Event;

export type CharacterEventMessage = Extract<
  Ps2EventMessage,
  { character_id: string }
>;

export type CharacterAttackEventMessage = Extract<
  Ps2EventMessage,
  { attacker_character_id: string }
>;

export type GainExperienceMessage = Stream.PS2Events.GainExperience;

export type EventName<T extends Ps2EventMessage = Ps2EventMessage> =
  T['event_name'];
