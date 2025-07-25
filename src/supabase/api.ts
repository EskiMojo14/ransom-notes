import type { SerializedError } from "@reduxjs/toolkit";
import { miniSerializeError } from "@reduxjs/toolkit";
import type {
  BaseQueryApi,
  BaseQueryFn,
  QueryReturnValue,
} from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import type {
  PostgrestError,
  PostgrestSingleResponse,
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

interface SupabaseQueryFnConfig<RawResult, QueryArg, Result = RawResult> {
  query: (arg: QueryArg) => QueryBuilder<RawResult>;
  transformResponse?: (data: RawResult) => Result;
}

type SupabaseQueryFn<RawResult, QueryArg, Result = RawResult> = (
  arg: QueryArg,
  api: BaseQueryApi,
) => Promise<QueryReturnValue<Result, SerializedPostgrestError, SupabaseMeta>>;

export function supabaseQueryFn<Result, QueryArg>(
  query: (arg: QueryArg) => QueryBuilder<Result>,
): SupabaseQueryFn<Result, QueryArg>;
export function supabaseQueryFn<RawResult, QueryArg, Result>(
  config: SupabaseQueryFnConfig<RawResult, QueryArg, Result>,
): SupabaseQueryFn<RawResult, QueryArg, Result>;
export function supabaseQueryFn<RawResult, QueryArg, Result>(
  queryOrConfig:
    | ((arg: QueryArg) => QueryBuilder<RawResult>)
    | SupabaseQueryFnConfig<RawResult, QueryArg, Result>,
): SupabaseQueryFn<RawResult, QueryArg, Result> {
  return async function queryFn(arg, api) {
    const {
      query,
      transformResponse = (data) => data as unknown as Result,
    }: SupabaseQueryFnConfig<RawResult, QueryArg, Result> =
      typeof queryOrConfig === "function"
        ? { query: queryOrConfig }
        : queryOrConfig;
    let builder = query(arg);
    if (builder.abortSignal) builder = builder.abortSignal(api.signal);
    const { data, error, status, statusText } = await builder;
    return error
      ? { error: serializePostgrestError(error), meta: { status, statusText } }
      : { data: transformResponse(data), meta: { status, statusText } };
  };
}

const fakeBaseQuery: BaseQueryFn<
  void,
  unknown,
  SerializedPostgrestError
> = () => {
  throw new Error("This should never be called, use queryFn instead");
};

export const api = createApi({
  reducerPath: "supabase",
  baseQuery: fakeBaseQuery,
  endpoints: () => ({}),
  tagTypes: ["User"],
});
