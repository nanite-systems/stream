import { Injectable } from '@nestjs/common';

@Injectable()
export class IdBroker {
  private nextId = 0;

  createId(): string {
    return (this.nextId++).toString(10);
  }
}
