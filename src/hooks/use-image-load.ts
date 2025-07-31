import { radEventListeners } from "rad-event-listeners";
import { useEffect, useState } from "react";

type Status = "loading" | "loaded" | "error" | "none";

export function useImageLoad(src: string | null | undefined) {
  const [status, setStatus] = useState<Status>(src ? "loading" : "none");
  useEffect(() => {
    if (!src) {
      // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
      setStatus("none");
      return;
    }
    // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
    setStatus("loading");
    const img = new Image();
    const unsub = radEventListeners(img, {
      load() {
        setStatus("loaded");
      },
      error() {
        setStatus("error");
      },
    });
    img.src = src;
    return () => {
      unsub();
    };
  }, [src]);
  return status;
}
