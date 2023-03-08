import { ArrayMaxSize, IsArray, IsBoolean, IsOptional } from 'class-validator';
import {
  TransformBoolean,
  TransformList,
} from '../../utils/census.transformers';
import { EventSubscribeQuery } from '../../subscription/concerns/event-subscribe-query.type';

export class SubscribeDto implements EventSubscribeQuery {
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(500)
  @TransformList()
  readonly worlds?: Array<string>;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(500)
  @TransformList()
  readonly characters?: Array<string>;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(500)
  @TransformList(false)
  readonly eventNames?: Array<string>;

  @IsOptional()
  @IsBoolean()
  @TransformBoolean()
  readonly logicalAndCharactersWithWorlds?: boolean;

  @IsBoolean()
  @TransformBoolean()
  readonly list_characters = false;
}
