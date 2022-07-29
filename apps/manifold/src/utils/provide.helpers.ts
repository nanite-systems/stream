import {
  FactoryProvider,
  InjectionToken,
  ScopeOptions,
  Type,
} from '@nestjs/common';
import { FactoryInterface } from './factory.interface';
import { SCOPE_OPTIONS_METADATA } from '@nestjs/common/constants';

export function provideFactory(
  provide: InjectionToken,
  factory: Type<FactoryInterface<any>>,
): FactoryProvider {
  const { scope }: ScopeOptions =
    Reflect.getMetadata(SCOPE_OPTIONS_METADATA, factory) ?? {};

  return {
    provide,
    useFactory: (factory: FactoryInterface<any>) => factory.create(),
    inject: [factory],
    scope,
  };
}
