import { IsNotEmpty } from 'class-validator';

export class EchoDto {
  @IsNotEmpty()
  payload: any;
}
