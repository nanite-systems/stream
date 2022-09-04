import { SubscribeDto } from './subscribe.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { TransformBoolean } from '../../utils/census.transformers';

export class ClearSubscribeDto extends SubscribeDto {
  @IsOptional()
  @IsBoolean()
  @TransformBoolean()
  readonly all?: boolean;
}
