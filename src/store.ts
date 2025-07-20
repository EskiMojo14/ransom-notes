import { combineSlices, configureStore } from "@reduxjs/toolkit";
import { api as supabaseApi } from "./supabase/api";

export const rootReducer = combineSlices(supabaseApi);

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(supabaseApi.middleware),
});
