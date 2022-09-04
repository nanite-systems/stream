import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';
import { TransformBoolean } from '../../utils/census.transformers';

export class SubscribeDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly worlds?: Array<string>;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly characters?: Array<string>;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly eventNames?: Array<string>;

  @IsOptional()
  @IsBoolean()
  @TransformBoolean()
  readonly logicalAndCharactersWithWorlds?: boolean;

  @IsBoolean()
  @TransformBoolean()
  readonly list_characters = false;
}
