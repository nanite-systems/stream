import { applyDecorators } from '@nestjs/common';
import { Expose } from 'class-transformer';
import { configStorage } from './config.storage';

export function ProcessEnv(env: string): PropertyDecorator {
  return applyDecorators(
    Expose(),
    (target: Object, property: string | symbol) => {
      configStorage.setEnvMetadata(target.constructor, property, { env });
    },
  );
}
