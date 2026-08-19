"use client";

import { Sidebar } from "@/components/admin/sidebar";
import { TopBar } from "@/components/admin/top-bar";
import { useMediaQuery, BREAKPOINTS } from "@/hooks/useMediaQuery";

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
        <main className="flex-1 overflow-y-auto scrollbar-thin pt-4 pr-0 pb-4 pl-3 md:pl-4">{children}</main>
      </div>
    </div>
  );
}
