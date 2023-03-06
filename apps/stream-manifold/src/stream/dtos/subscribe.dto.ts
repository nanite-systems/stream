import { IsArray, IsBoolean, IsOptional } from 'class-validator';
import {
  TransformBoolean,
  TransformList,
} from '../../utils/census.transformers';
import { EventSubscribeQuery } from '../../subscription/concerns/event-subscribe-query.type';

export class SubscribeDto implements EventSubscribeQuery {
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
