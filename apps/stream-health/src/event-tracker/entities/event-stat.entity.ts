import {
  Entity,
  Index,
  PrimaryKey,
  PrimaryKeyType,
  Property,
} from '@mikro-orm/core';

@Entity()
@Index({ properties: ['eventName', 'worldId', 'timestamp', 'events'] })
export class EventStat {
  constructor(data?: Omit<EventStat, typeof PrimaryKeyType>) {
    Object.assign(this, data);
  }

  [PrimaryKeyType]?: [string, string, Date];

  @PrimaryKey()
  eventName: string;

  @PrimaryKey()
  worldId: string;

  @PrimaryKey()
  timestamp: Date;

  @Property()
  events: number;
}
