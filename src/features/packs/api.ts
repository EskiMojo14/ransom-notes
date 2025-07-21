import { supabase } from "@/supabase";
import { api, supabaseQueryFn } from "@/supabase/api";
import type { Tables } from "@/supabase/types";

export type Pack = Tables<"packs">;

export const packsApi = api
  .enhanceEndpoints({ addTagTypes: ["Pack"] })
  .injectEndpoints({
    endpoints: (build) => ({
      // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
      getPackLanguages: build.query<Array<string>, void>({
        queryFn: supabaseQueryFn(
          () =>
            supabase
              .from("packs")
              .select("lang")
              .order("lang", { ascending: true }),
          (packs) => packs.map((pack) => pack.lang),
        ),
        providesTags: ["Pack"],
      }),
      getPackByLanguage: build.query<Pack, string>({
        queryFn: supabaseQueryFn(
          (lang) =>
            supabase.from("packs").select("*").eq("lang", lang).single(),
          (pack) => pack,
        ),
        providesTags: (_res, _err, lang) => [{ type: "Pack", id: lang }],
      }),
    }),
  });

export const { useGetPackLanguagesQuery, useGetPackByLanguageQuery } = packsApi;
