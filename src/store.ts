import {
  combineSlices,
  configureStore,
  type ThunkAction,
  type UnknownAction,
} from "@reduxjs/toolkit";
import { gameSlice } from "./features/game/slice";
import { api as supabaseApi } from "./supabase/api";

export const rootReducer = combineSlices(gameSlice, supabaseApi);

export type RootState = ReturnType<typeof rootReducer>;
export type PreloadedState = Parameters<typeof rootReducer>[0];

export function makeStore(preloadedState?: PreloadedState) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(supabaseApi.middleware),
  });
}

export const store = makeStore();

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<Return = void> = ThunkAction<
  Return,
  RootState,
  undefined,
  UnknownAction
>;
