import type { SerializedError } from "@reduxjs/toolkit";
import { miniSerializeError } from "@reduxjs/toolkit";
import type {
  BaseQueryFn,
  EndpointBuilder,
  EndpointDefinitions,
  MutationDefinition,
  QueryDefinition,
} from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import type {
  PostgrestError,
  PostgrestSingleResponse,
  QueryData,
} from "@supabase/supabase-js";
import type { Compute, PickRequired } from "@/utils/types";

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

export const supaBaseQuery: BaseQueryFn<
  QueryBuilder<unknown>,
  unknown,
  SerializedPostgrestError
> = async (query, { signal }) => {
  if (query.abortSignal) query = query.abortSignal(signal);
  const { data, error, status, statusText } = await query;
  return error
    ? { error: serializePostgrestError(error, status, statusText) }
    : { data };
};
type SupaBaseQuery = typeof supaBaseQuery;

type SupaQueryDefinition<
  TagTypes extends string,
  ReducerPath extends string,
  QueryArg,
  Builder extends QueryBuilder<unknown>,
  TransformedResultType = QueryData<Builder>,
> = Compute<
  Omit<
    Extract<
      QueryDefinition<
        QueryArg,
        SupaBaseQuery,
        TagTypes,
        TransformedResultType,
        ReducerPath,
        QueryData<Builder>
      >,
      { query: {} }
    >,
    "query" | "type"
  > & {
    query: (arg: QueryArg) => Builder;
  }
>;

type SupaMutationDefinition<
  TagTypes extends string,
  ReducerPath extends string,
  QueryArg,
  Builder extends QueryBuilder<unknown>,
  TransformedResultType = QueryData<Builder>,
> = Compute<
  Omit<
    Extract<
      MutationDefinition<
        QueryArg,
        SupaBaseQuery,
        TagTypes,
        TransformedResultType,
        ReducerPath,
        QueryData<Builder>
      >,
      { query: {} }
    >,
    "query" | "type"
  > & {
    query: (arg: QueryArg) => Builder;
  }
>;

interface SupaEndpointBuilder<
  TagTypes extends string,
  ReducerPath extends string,
> {
  query<Builder extends QueryBuilder<unknown>, QueryArg, TransformedResultType>(
    definition: PickRequired<
      SupaQueryDefinition<
        TagTypes,
        ReducerPath,
        QueryArg,
        Builder,
        TransformedResultType
      >,
      "transformResponse"
    >,
  ): QueryDefinition<
    QueryArg,
    SupaBaseQuery,
    TagTypes,
    TransformedResultType,
    ReducerPath,
    QueryData<Builder>
  >;
  query<Builder extends QueryBuilder<unknown>, QueryArg>(
    definition: Omit<
      SupaQueryDefinition<TagTypes, ReducerPath, QueryArg, Builder>,
      "transformResponse"
    >,
  ): QueryDefinition<
    QueryArg,
    SupaBaseQuery,
    TagTypes,
    QueryData<Builder>,
    ReducerPath,
    QueryData<Builder>
  >;

  mutation<
    Builder extends QueryBuilder<unknown>,
    QueryArg,
    TransformedResultType,
  >(
    definition: PickRequired<
      SupaMutationDefinition<
        TagTypes,
        ReducerPath,
        QueryArg,
        Builder,
        TransformedResultType
      >,
      "transformResponse"
    >,
  ): MutationDefinition<
    QueryArg,
    SupaBaseQuery,
    TagTypes,
    TransformedResultType,
    ReducerPath,
    QueryData<Builder>
  >;
  mutation<Builder extends QueryBuilder<unknown>, QueryArg>(
    definition: Omit<
      SupaMutationDefinition<TagTypes, ReducerPath, QueryArg, Builder>,
      "transformResponse"
    >,
  ): MutationDefinition<
    QueryArg,
    SupaBaseQuery,
    TagTypes,
    QueryData<Builder>,
    ReducerPath,
    QueryData<Builder>
  >;
}

export const supaEnhance = <
  TagTypes extends string,
  ReducerPath extends string,
  Definitions extends EndpointDefinitions,
>(
  buildCallback: (
    build: SupaEndpointBuilder<TagTypes, ReducerPath>,
  ) => Definitions,
): ((
  build: EndpointBuilder<SupaBaseQuery, TagTypes, ReducerPath>,
) => Definitions) => buildCallback;

export const api = createApi({
  reducerPath: "supabase",
  baseQuery: supaBaseQuery,
  endpoints: () => ({}),
  tagTypes: ["User"],
});
