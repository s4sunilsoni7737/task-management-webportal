import { useSyncExternalStore } from "react";

function subscribeToQuery(query: string) {
  return (onStoreChange: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", onStoreChange);
    return () => mql.removeEventListener("change", onStoreChange);
  };
}

/**
 * SSR-safe media query hook built on `useSyncExternalStore` — no cascading
 * setState-in-effect (0ms first paint on desktop/mobile layouts).
 * Returns false on the server and until the browser paints.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    subscribeToQuery(query),
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** Breakpoints referenced across the app shell, per design_break_down.md §14. */
export const BREAKPOINTS = {
  tablet: "(max-width: 899px)",
  mobile: "(max-width: 699px)",
} as const;
