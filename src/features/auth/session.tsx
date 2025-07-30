import type { Session } from "@supabase/supabase-js";
import { assert } from "es-toolkit";
import { useEffect, useState, type ReactNode } from "react";
import { createRequiredContext } from "required-react-context";
import { supabase } from "@/supabase";

export const { OriginalSessionProvider, useNullableSession } =
  createRequiredContext<Session | null>().with({
    name: "session",
    providerName: "OriginalSessionProvider",
    hookName: "useNullableSession",
  });

export function useSession() {
  const session = useNullableSession();
  assert(session, "Session should exist");
  return session;
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setSession(null);
      } else if (session) {
        setSession(session);
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  return (
    <OriginalSessionProvider session={session}>
      {children}
    </OriginalSessionProvider>
  );
}
