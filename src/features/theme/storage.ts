import * as v from "valibot";
import { createLocalAndDataStore } from "@/utils";

export const themeSchema = v.picklist(["light", "dark", "system"]);
export type Theme = v.InferOutput<typeof themeSchema>;

export const themeStore = createLocalAndDataStore("theme", themeSchema);

// make sure theme is synced on load
themeStore.get();
