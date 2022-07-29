export interface FactoryInterface<T> {
  create(): T | Promise<T>;
}
