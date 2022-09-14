import { IsArray, IsBoolean, IsOptional } from 'class-validator';
import {
  TransformBoolean,
  TransformList,
} from '../../utils/census.transformers';

export class SubscribeDto {
  @IsOptional()
  @IsArray()
  @TransformList()
  readonly worlds?: Array<string>;

  @IsOptional()
  @IsArray()
  @TransformList()
  readonly characters?: Array<string>;

  @IsOptional()
  @IsArray()
  @TransformList()
  readonly eventNames?: Array<string>;

  @IsOptional()
  @IsBoolean()
  @TransformBoolean()
  readonly logicalAndCharactersWithWorlds?: boolean;

  @IsBoolean()
  @TransformBoolean()
  readonly list_characters = false;
}
