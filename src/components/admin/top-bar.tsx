"use client";

import type { ReactNode } from "react";
import { PanelLeft } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { useUiStore } from "@/store/uiStore";
import { useMediaQuery, BREAKPOINTS } from "@/hooks/useMediaQuery";

interface TopBarProps {
  /** Breadcrumbs or page context — only present on nested pages like Task Detail. */
  left?: ReactNode;
  /** Page-specific icon actions (lock, watchers, share, overflow, panel toggle). */
  right?: ReactNode;
}

/**
 * Slim 52px top bar shared by every page. Always renders the
 * sidebar-collapse (desktop) / open-drawer (mobile) toggle on the left,
 * per design_break_down.md §3.2.
 */
export function TopBar({ left, right }: TopBarProps) {
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const setMobileSidebarOpen = useUiStore((s) => s.setMobileSidebarOpen);
  const isTablet = useMediaQuery(BREAKPOINTS.tablet);

  return (
    <header className="sticky top-0 z-sticky flex h-[52px] shrink-0 items-center gap-3 border-b border-border bg-surface px-3">
      <IconButton
        aria-label={isTablet ? "Open sidebar" : "Toggle sidebar"}
        onClick={() => (isTablet ? setMobileSidebarOpen(true) : toggleSidebar())}
      >
        <PanelLeft className="h-4 w-4" />
      </IconButton>
      <div className="h-5 w-px bg-border" />
      <div className="min-w-0 flex-1 overflow-hidden">{left}</div>
      {right && (
        <div className="flex shrink-0 items-center gap-1 overflow-x-auto scrollbar-thin sm:gap-1.5">
          {right}
        </div>
      )}
    </header>
  );
}
