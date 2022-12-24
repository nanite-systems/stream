import { Entity, Index, PrimaryKey, Property } from '@mikro-orm/core';
import { Exclude } from 'class-transformer';

@Entity()
@Index<ServiceState>({ properties: ['worldId', 'timestamp'] })
export class ServiceState {
  constructor(data?: Omit<ServiceState, 'id'>) {
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
