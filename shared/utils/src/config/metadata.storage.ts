import { Injectable } from '@nestjs/common';
import { EnvOptions } from './env.options';

@Injectable()
export class MetadataStorage {
  private readonly configMap = new Map<
    Function,
    Map<string | symbol, EnvOptions>
  >();

  setEnvMetadata(
    target: Function,
    property: string | symbol,
    config: EnvOptions,
  ): void {
    if (!this.configMap.has(target)) this.configMap.set(target, new Map());

    this.configMap.get(target).set(property, config);
  }

  getEnvProperties(target: Function): (string | symbol)[] {
    if (!this.configMap.has(target)) return [];

    return Array.from(this.configMap.get(target).keys());
  }

  getEnvMetadata(
    target: Function,
    property: string | symbol,
  ): EnvOptions | null {
    return this.configMap.get(target)?.get(property) ?? null;
  }
}
