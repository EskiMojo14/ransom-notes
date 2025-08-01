import type { SerializedError } from "@reduxjs/toolkit";
import { miniSerializeError } from "@reduxjs/toolkit";
import type {
  BaseQueryApi,
  BaseQueryFn,
  QueryReturnValue,
} from "@reduxjs/toolkit/query";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  PostgrestError,
  PostgrestSingleResponse,
} from "@supabase/supabase-js";
import { wait } from "@/utils";

export interface SerializedPostgrestError
  extends SerializedError,
    Partial<Omit<PostgrestError, keyof SerializedError>>,
    SupabaseMeta {}

export interface SupabaseMeta {
  status?: number;
  statusText?: string;
  count?: number | null;
}

export interface SupabaseExtraOptions {
  /**
   * Pend for at least this many milliseconds before returning, to avoid loading indicators from flashing on the screen.
   * If set to `true`, uses a default value of 1000ms.
   */
  minimumPendingTime?: number | boolean;
}

const minPendingTime = 1000;

const getPendingPromise = (
  { type }: BaseQueryApi,
  { minimumPendingTime = type === "mutation" }: SupabaseExtraOptions,
) => {
  if (!minimumPendingTime) return undefined;
  return wait(
    minimumPendingTime === true
      ? minPendingTime
      : Math.max(minimumPendingTime, minPendingTime),
  );
};

const serializePostgrestError = (
  error: PostgrestError,
  meta: SupabaseMeta,
): SerializedPostgrestError => {
  return {
    ...miniSerializeError(error),
    code: error.code,
    details: error.details,
    hint: error.hint,
    ...meta,
  };
};

interface QueryBuilder<Response>
  extends PromiseLike<PostgrestSingleResponse<Response>> {
  // optional because .single() doesn't know about it
  abortSignal?(signal: AbortSignal): this;
}

interface SupabaseQueryFnConfig<RawResult, QueryArg, Result = RawResult> {
  query: (arg: QueryArg) => QueryBuilder<RawResult>;
  transformResponse?: (data: RawResult, meta: SupabaseMeta) => Result;
}

type SupabaseQueryFn<RawResult, QueryArg, Result = RawResult> = (
  arg: QueryArg,
  api: BaseQueryApi,
  extraOptions: SupabaseExtraOptions | undefined,
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
  return async function queryFn(arg, api, extraOptions = {}) {
    const {
      query,
      transformResponse = (data) => data as unknown as Result,
    }: SupabaseQueryFnConfig<RawResult, QueryArg, Result> =
      typeof queryOrConfig === "function"
        ? { query: queryOrConfig }
        : queryOrConfig;
    let builder = query(arg);
    if (builder.abortSignal) builder = builder.abortSignal(api.signal);
    const [{ data, error, count, status, statusText }] = await Promise.all([
      builder,
      getPendingPromise(api, extraOptions),
    ]);
    const meta: SupabaseMeta = { status, statusText, count };
    return error
      ? { error: serializePostgrestError(error, meta), meta }
      : { data: transformResponse(data, meta), meta };
  };
}

const supaFakeBaseQuery: BaseQueryFn<
  void,
  unknown,
  SerializedPostgrestError,
  SupabaseExtraOptions,
  SupabaseMeta
> = fakeBaseQuery();

export const api = createApi({
  reducerPath: "supabase",
  baseQuery: supaFakeBaseQuery,
  endpoints: () => ({}),
  tagTypes: ["User"],
});
