import { useEffect } from "react";

/** Fires `handler` when Escape is pressed. Used by every popover/menu/modal. */
export function useEscapeKey(handler: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") handler();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [handler, enabled]);
}
