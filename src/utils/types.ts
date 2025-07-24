// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export type Compute<T> = { [K in keyof T]: T[K] } & unknown;

export type PickRequired<T, K extends keyof T> = Compute<
  Omit<T, K> & Required<Pick<T, K>>
>;

export type QueryBuilders = Record<
  string,
  (...args: never) => PromiseLike<unknown>
>;

export type EndpointsForQueries<T extends QueryBuilders> = Record<
  keyof T,
  unknown
>;

export type QueryBuilderData<
  T extends QueryBuilders,
  K extends keyof T,
> = T[K] extends (...args: never) => PromiseLike<{ data: infer U }>
  ? Exclude<U, null>
  : never;
