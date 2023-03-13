export class ValidationResponse {
  constructor(public readonly valid: boolean, public readonly token: string) {}
}
