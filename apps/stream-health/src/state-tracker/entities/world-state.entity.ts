import { Entity, Index, PrimaryKey, Property } from '@mikro-orm/core';
import { Exclude } from 'class-transformer';

@Entity()
@Index<WorldState>({ properties: ['worldId', 'timestamp'] })
export class WorldState {
  constructor(data?: Omit<WorldState, 'id'>) {
    Object.assign(this, data);
  }

  @PrimaryKey()
  @Exclude()
  readonly id: number;

  @Property()
  worldId: string;

  @Property()
  up: boolean;

  @Property()
  timestamp: Date;
}
