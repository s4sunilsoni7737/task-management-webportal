"use client";

import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";
import { useMediaQuery, BREAKPOINTS } from "../../hooks/useMediaQuery";

/**
 * Top-level shell (senior adminportal pattern): renders the sidebar (inline
 * rail on desktop, drawer below the tablet breakpoint), the shared top bar,
 * and the scrollable main area. Pages only return their own content — the
 * shell is provided here, exactly like adminportal's (admin)/layout.tsx.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const isTablet = useMediaQuery(BREAKPOINTS.tablet);

  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      <Sidebar variant={isTablet ? "drawer" : "rail"} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="flex-1 overflow-y-auto scrollbar-thin p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
