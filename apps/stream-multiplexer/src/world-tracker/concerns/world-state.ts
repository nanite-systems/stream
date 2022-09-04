import { PS2Environment } from 'ps2census';

export interface WorldState {
  environment: PS2Environment;
  detail: string;
  worldId: string;
  state: boolean;
}
