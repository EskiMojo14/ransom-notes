import type { SerializedError } from "@reduxjs/toolkit";
import { miniSerializeError } from "@reduxjs/toolkit";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  PostgrestError,
  PostgrestSingleResponse,
} from "@supabase/supabase-js";

export interface SerializedPostgrestError
  extends SerializedError,
    Partial<Omit<PostgrestError, keyof SerializedError>> {
  status?: number;
  statusText?: string;
}

const serializePostgrestError = (
  error: PostgrestError,
  status: number,
  statusText: string,
): SerializedPostgrestError => {
  return {
    ...miniSerializeError(error),
    code: error.code,
    details: error.details,
    hint: error.hint,
    status,
    statusText,
  };
};

interface QueryBuilder<Response>
  extends PromiseLike<PostgrestSingleResponse<Response>> {
  // optional because .single() doesn't know about it
  abortSignal?(signal: AbortSignal): this;
}

export interface QueryBuilderFn<TArg, TResponse, TRawResponse = TResponse> {
  (
    arg: TArg,
    api: { signal: AbortSignal },
  ): Promise<{ data: TResponse } | { error: SerializedPostgrestError }>;
  buildQuery: (arg: TArg) => QueryBuilder<TRawResponse>;
  transformResponse: (data: TRawResponse) => TResponse;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MockFor<T extends QueryBuilderFn<any, any>> = T extends {
  buildQuery: (arg: never) => QueryBuilder<infer TRawResponse>;
}
  ? TRawResponse
  : never;

export function supabaseQueryFn<TArg, TResponse>(
  buildQuery: (arg: TArg) => QueryBuilder<TResponse>,
): QueryBuilderFn<TArg, TResponse>;
export function supabaseQueryFn<TArg, TResponse, TTransformed = TResponse>(
  buildQuery: (arg: TArg) => QueryBuilder<TResponse>,
  transformResponse: (data: TResponse) => TTransformed,
): QueryBuilderFn<TArg, TTransformed, TResponse>;
export function supabaseQueryFn<TArg, TResponse, TTransformed = TResponse>(
  buildQuery: (arg: TArg) => QueryBuilder<TResponse>,
  transformResponse: (data: TResponse) => TTransformed = (data) =>
    data as unknown as TTransformed,
): QueryBuilderFn<TArg, TTransformed, TResponse> {
  async function queryFn(
    arg: TArg,
    { signal }: { signal: AbortSignal },
  ): Promise<{ data: TTransformed } | { error: SerializedPostgrestError }> {
    let query = buildQuery(arg);
    // the builder returned by .single doesn't know it has this, but it does
    if (query.abortSignal) query = query.abortSignal(signal);

    const { data, error, status, statusText } = await query;
    return error
      ? { error: serializePostgrestError(error, status, statusText) }
      : { data: transformResponse(data) };
  }
  queryFn.buildQuery = buildQuery;
  queryFn.transformResponse = transformResponse;
  return queryFn;
}

export const api = createApi({
  reducerPath: "supabase",
  baseQuery: fakeBaseQuery<SerializedPostgrestError>(),
  endpoints: () => ({}),
  tagTypes: ["User"],
});
