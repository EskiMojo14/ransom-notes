import type { Session } from "@supabase/supabase-js";
import { assert } from "es-toolkit";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { createRequiredContext } from "required-react-context";
import { useDevDebugValue } from "@/hooks/use-dev-debug-value";
import { supabase } from "@/supabase";

export const { OriginalSessionProvider, useNullableSession } =
  createRequiredContext<Session | null>().with({
    name: "session",
    providerName: "OriginalSessionProvider",
    hookName: "useNullableSession",
  });

export function useSession() {
  const session = useNullableSession();
  useDevDebugValue(session);
  assert(session, "Session should exist");
  return session;
}
export function SessionProvider({
  children,
  initialSession,
}: {
  children: ReactNode;
  initialSession: Session | null;
}) {
  const [session, setSession] = useState(initialSession);
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
