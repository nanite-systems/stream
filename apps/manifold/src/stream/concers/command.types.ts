// TODO: Add class validator

export type PS2EventNames =
  | 'AchievementEarned'
  | 'BattleRankUp'
  | 'Death'
  | 'GainExperience'
  | 'ItemAdded'
  | 'PlayerFacilityCapture'
  | 'PlayerFacilityDefend'
  | 'PlayerLogin'
  | 'PlayerLogout'
  | 'SkillAdded'
  | 'VehicleDestroy'
  | 'ContinentLock'
  | 'ContinentUnlock'
  | 'FacilityControl'
  | 'MetagameEvent';

export type Echo = {
  service: 'event';
  action: 'echo';
  payload: unknown;
};

export type Subscribe = {
  service: 'event';
  action: 'subscribe';
  characters?: string[];
  eventNames?: ('all' | PS2EventNames)[];
  worlds?: string[];
  logicalAndCharacters?: boolean;
};

export type ClearSubscribe = {
  service: 'event';
  action: 'clearSubscribe';
  all?: boolean;
  characters?: string[];
  eventNames?: ('all' | PS2EventNames)[];
  worlds?: string[];
};

export type RecentCharacters = {
  service: 'event';
  action: 'recentCharacterIds';
};

export type RecentCharactersCount = {
  service: 'event';
  action: 'recentCharacterIdsCount';
};
