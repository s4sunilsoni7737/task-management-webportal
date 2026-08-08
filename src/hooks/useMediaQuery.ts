import { useEffect, useState } from "react";

/** SSR-safe media query hook. Returns false on the server and first client render. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);
    mql.addEventListener("change", listener);
    return () => mql.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

/** Breakpoints referenced across the app shell, per design_break_down.md §14. */
export const BREAKPOINTS = {
  tablet: "(max-width: 899px)",
  mobile: "(max-width: 699px)",
} as const;
