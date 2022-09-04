import { PS2Environment } from 'ps2census';
import { IsIn } from 'class-validator';

export class FetchRecentCharactersDto {
  @IsIn(['ps2', 'ps2ps4eu', 'ps2ps4us'])
  environment: PS2Environment;
}
