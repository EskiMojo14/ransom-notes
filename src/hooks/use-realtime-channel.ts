import type { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect, type DependencyList } from "react";

export function useRealtimeChannel(
  channelFactory: () => RealtimeChannel,
  deps: DependencyList,
) {
  useEffect(() => {
    const channel = channelFactory();
    return () => {
      void channel.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
