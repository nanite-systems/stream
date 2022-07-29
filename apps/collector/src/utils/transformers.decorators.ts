import { Transform } from 'class-transformer';

export function BoolTransform() {
  return Transform(({ value }) =>
    ['true', 'false'].includes(value?.toLowerCase())
      ? value.toLowerCase() == 'true'
      : value,
  );
}
