import type { SerializedError } from "@reduxjs/toolkit";
import { miniSerializeError } from "@reduxjs/toolkit";
import type {
  BaseQueryApi,
  BaseQueryFn,
  QueryReturnValue,
} from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import type {
  PostgrestError,
  PostgrestSingleResponse,
  QueryData,
} from "@supabase/supabase-js";

export interface SerializedPostgrestError
  extends SerializedError,
    Partial<Omit<PostgrestError, keyof SerializedError>> {}

export interface SupabaseMeta {
  status?: number;
  statusText?: string;
}

const serializePostgrestError = (
  error: PostgrestError,
): SerializedPostgrestError => {
  return {
    ...miniSerializeError(error),
    code: error.code,
    details: error.details,
    hint: error.hint,
  };
};

interface QueryBuilder<Response>
  extends PromiseLike<PostgrestSingleResponse<Response>> {
  // optional because .single() doesn't know about it
  abortSignal?(signal: AbortSignal): this;
}

export const supaBaseQuery: BaseQueryFn<
  QueryBuilder<unknown>,
  unknown,
  SerializedPostgrestError,
  SupabaseMeta
> = async (query, { signal }) => {
  if (query.abortSignal) query = query.abortSignal(signal);
  const { data, error, status, statusText } = await query;
  return error
    ? { error: serializePostgrestError(error), meta: { status, statusText } }
    : { data, meta: { status, statusText } };
};
type SupaBaseQuery = typeof supaBaseQuery;

interface SupabaseQueryFnConfig<
  Builder extends QueryBuilder<unknown>,
  QueryArg,
  Result = QueryData<Builder>,
> {
  query: (arg: QueryArg) => Builder;
  transformResponse?: (data: QueryData<Builder>) => Result;
}

export const supabaseQueryFn =
  <
    Builder extends QueryBuilder<unknown>,
    QueryArg,
    Result = QueryData<Builder>,
  >(
    queryOrConfig:
      | ((arg: QueryArg) => Builder)
      | SupabaseQueryFnConfig<Builder, QueryArg, Result>,
  ) =>
  async (
    arg: QueryArg,
    api: BaseQueryApi,
    _eO: {},
    fetchWithBq: (
      arg: Parameters<typeof supaBaseQuery>[0],
    ) => ReturnType<typeof supaBaseQuery>,
  ): Promise<
    QueryReturnValue<Result, SerializedPostgrestError, SupabaseMeta>
  > => {
    const {
      query,
      transformResponse = (data) => data as Result,
    }: SupabaseQueryFnConfig<Builder, QueryArg, Result> =
      typeof queryOrConfig === "function"
        ? { query: queryOrConfig }
        : queryOrConfig;
    let builder = query(arg);
    if (builder.abortSignal) builder = builder.abortSignal(api.signal);
    const { data, error, meta } = await fetchWithBq(builder);
    return error
      ? { error, meta }
      : { data: transformResponse(data as QueryData<Builder>), meta };
  };

export const api = createApi({
  reducerPath: "supabase",
  baseQuery: supaBaseQuery,
  endpoints: () => ({}),
  tagTypes: ["User"],
});

/* eslint-disable @typescript-eslint/no-explicit-any */
type AnyFilterBuilder = PostgrestFilterBuilder<any, any, any, any, any>;
/* eslint-enable @typescript-eslint/no-explicit-any */

export const cloneBuilder = <T extends AnyFilterBuilder>(builder: T) =>
  new PostgrestFilterBuilder(builder as never) as T;
