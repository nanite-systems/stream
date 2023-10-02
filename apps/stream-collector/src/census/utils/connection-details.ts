export class ConnectionDetails {
  constructor(readonly id: number) {}

  get label() {
    return `Connection-${this.id}`;
  }
}
