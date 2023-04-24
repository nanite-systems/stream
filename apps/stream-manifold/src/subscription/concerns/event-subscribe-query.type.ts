export interface EventSubscribeQuery {
  worlds?: Array<string>;

  characters?: Array<string>;

  eventNames?: Array<string>;

  logicalAndCharactersWithWorlds?: boolean;
}
