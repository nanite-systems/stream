import { Injectable } from '@nestjs/common';

@Injectable()
export class StreamConductorService {
  private readonly accepted = new Map<string, number>();

  claim(connection: string, offset: number): boolean {
    for (const [, accepted] of this.accepted)
      if (accepted == offset) return false;

    this.accepted.set(connection, offset);
    return true;
  }

  release(connection: string): void {
    this.accepted.delete(connection);
  }
}
