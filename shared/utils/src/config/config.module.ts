import 'reflect-metadata';
import { DynamicModule, Module, Type } from '@nestjs/common';
import { expand } from 'dotenv-expand';
import { config, DotenvConfigOptions } from 'dotenv';
import { configStorage } from './config.storage';
import { plainToInstance } from 'class-transformer';

@Module({})
export class ConfigModule {
  static forRoot(options?: DotenvConfigOptions): void {
    expand(config(options));
  }

  static forFeature(configs: Type[]): DynamicModule {
    return {
      module: ConfigModule,
      providers: configs.map((config) => ({
        provide: config,
        useFactory: () => this.resolveConfig(config),
      })),
      exports: configs,
    };
  }

  static resolveConfig(config: Type) {
    // const logger = new Logger('Config');
    const base = {} as any;

    // Hydrate the base instance
    for (const property of configStorage.getEnvProperties(config)) {
      const options = configStorage.getEnvMetadata(config, property);

      if (options && process.env[options.env])
        base[property] = process.env[options.env];
    }

    // Transform the base instance
    const instance = plainToInstance(config, base, {
      excludeExtraneousValues: true,
      exposeDefaultValues: true,
    });

    return Object.freeze(instance);
  }
}
