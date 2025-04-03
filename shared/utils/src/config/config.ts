import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';

export function buildConfig<T>(constructor: (env: Environment) => T) {
  dotenvExpand.expand(dotenv.config());
  const env = new Environment();

  return constructor(env);
}

export class Environment {
  get(name: string): string | undefined;
  get(name: string, def: string): string;
  get(name: string, def?: string): string | undefined {
    return process.env[name] ?? def;
  }

  getInt(name: string, radix: number): number | undefined;
  getInt(name: string, radix: number, def: number): number;
  getInt(name: string, radix: number, def?: number): number | undefined {
    if (['inf', 'infinity'].includes(process.env[name]?.toLowerCase()))
      return Infinity;

    return parseInt(process.env[name], radix) || def;
  }

  getFloat(name: string): number | undefined;
  getFloat(name: string, def: number): number;
  getFloat(name: string, def?: number): number | undefined {
    return parseFloat(process.env[name]) || def;
  }

  getBool(name: string): boolean | undefined;
  getBool(name: string, def: boolean): boolean;
  getBool(name: string, def?: boolean): boolean | undefined {
    const val = process.env[name]?.toLowerCase();
    if (['true', 'false'].includes(val)) return val == 'true';

    return def;
  }

  getSplit(name: string, separator?: string): string[] | undefined;
  getSplit(name: string, def: string[], separator?: string): string[];
  getSplit(
    name: string,
    defOrSeparator?: string[] | string,
    separator?: string,
  ): string[] | undefined {
    let def: string[] = undefined;

    if (Array.isArray(defOrSeparator)) def = defOrSeparator;
    else separator = defOrSeparator;

    separator ??= ',';

    return process.env[name]?.split(separator) ?? def;
  }
}
