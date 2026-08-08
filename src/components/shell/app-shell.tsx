"use client";

import { Sidebar } from "./sidebar";
import { useMediaQuery, BREAKPOINTS } from "../../hooks/useMediaQuery";

/**
 * Top-level shell: renders the sidebar as an inline rail on desktop and
 * swaps to an overlay drawer below the tablet breakpoint (design_break_down.md §14).
 * `children` is expected to render its own `TopBar` + page content.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const isTablet = useMediaQuery(BREAKPOINTS.tablet);

  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      <Sidebar variant={isTablet ? "drawer" : "rail"} />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
