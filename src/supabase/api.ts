import type { SerializedError } from "@reduxjs/toolkit";
import { miniSerializeError } from "@reduxjs/toolkit";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  PostgrestError,
  PostgrestSingleResponse,
} from "@supabase/supabase-js";

interface SerializedPostgrestError
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

export function supabaseQueryFn<TArg, TResponse>(
  buildQuery: (arg: TArg) => QueryBuilder<TResponse>,
): (
  arg: TArg,
) => Promise<{ data: TResponse } | { error: SerializedPostgrestError }>;
export function supabaseQueryFn<TArg, TResponse, TTransformed = TResponse>(
  buildQuery: (arg: TArg) => QueryBuilder<TResponse>,
  transformResponse: (data: TResponse) => TTransformed,
): (
  arg: TArg,
) => Promise<{ data: TTransformed } | { error: SerializedPostgrestError }>;
export function supabaseQueryFn<TArg, TResponse, TTransformed = TResponse>(
  buildQuery: (arg: TArg) => QueryBuilder<TResponse>,
  transformResponse: (data: TResponse) => TTransformed = (data) =>
    data as unknown as TTransformed,
) {
  return async function queryFn(
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
  };
}

export const api = createApi({
  reducerPath: "supabase",
  baseQuery: fakeBaseQuery<SerializedPostgrestError>(),
  endpoints: () => ({}),
  tagTypes: ["User"],
});
