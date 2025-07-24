// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export type Compute<T> = { [K in keyof T]: T[K] } & unknown;

export type PickRequired<T, K extends keyof T> = Compute<
  Omit<T, K> & Required<Pick<T, K>>
>;

export type TupleOf<
  T,
  Length extends number,
  Acc extends Array<T> = [],
> = Acc["length"] extends Length ? Acc : TupleOf<T, Length, [...Acc, T]>;

export const hasLength = <T, Length extends number>(
  arr: Array<T>,
  length: Length,
): arr is TupleOf<T, Length> => arr.length === length;

export type TupleOfAtLeast<T, MinLength extends number> = TupleOf<
  T,
  MinLength
> &
  Array<T>;

export const hasMinLength = <T, MinLength extends number>(
  arr: Array<T>,
  minLength: MinLength,
): arr is TupleOfAtLeast<T, MinLength> => arr.length >= minLength;
