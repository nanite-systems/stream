import { Transform } from 'class-transformer';

export function TransformBoolean(): PropertyDecorator {
  return Transform(({ value }) => {
    switch (typeof value) {
      case 'boolean':
        return value;

      case 'string':
        return ['true', 'false'].includes(value.toLowerCase())
          ? value.toLowerCase() == 'true'
          : value;

      default:
        return value;
    }
  });
}

export function TransformList(toString = true): PropertyDecorator {
  return Transform(({ value }) => {
    if (Array.isArray(value))
      return value.map((item) =>
        toString && typeof item != 'string' ? JSON.stringify(item) : item,
      );

    return value;
  });
}
