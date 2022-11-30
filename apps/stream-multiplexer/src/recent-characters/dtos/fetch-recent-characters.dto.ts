import { IsIn } from 'class-validator';

export class FetchRecentCharactersDto {
  @IsIn(['ps2', 'ps2ps4eu', 'ps2ps4us', 'all'])
  environment: string;
}
