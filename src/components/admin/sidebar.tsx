"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import { Layers, ChevronDown, ChevronRight, ChevronsUpDown, LayoutDashboard } from "lucide-react";
import { WorkspaceMenu } from "@/components/admin/workspace-menu";
import { Avatar } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/authStore";
import { useUiStore } from "@/store/uiStore";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { routes } from "@/lib/routeBuilder";
import { cn } from "@/lib/utils";
import { DEFAULT_WORKSPACE_NAME } from "@/constants";

interface SidebarProps {
  /** True on mobile/tablet — renders as an overlay drawer instead of an inline rail. */
  variant: "rail" | "drawer";
}

/**
 * Left navigation sidebar. Composes WorkspaceSwitcher (top), the
 * collapsible "Workspace" section with Tasks/Projects nav items, and the
 * bottom-anchored user block that opens WorkspaceMenu.
 */
export function Sidebar({ variant }: SidebarProps) {
  const user = useAuthStore((s) => s.user);
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const mobileSidebarOpen = useUiStore((s) => s.mobileSidebarOpen);
  const setMobileSidebarOpen = useUiStore((s) => s.setMobileSidebarOpen);

  const [workspaceSectionOpen, setWorkspaceSectionOpen] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const userBlockRef = useRef<HTMLButtonElement>(null!);

  const isDrawer = variant === "drawer";
  const isIconRail = variant === "rail" && collapsed;

  const content = (
    <div className="flex h-full flex-col bg-sidebar">
      <WorkspaceSwitcher isIconRail={isIconRail} />

      <nav className="flex-1 overflow-y-auto scrollbar-thin px-2.5 pt-2">
        {!isIconRail && (
          <button
            type="button"
            onClick={() => setWorkspaceSectionOpen((v) => !v)}
            className="flex h-9 w-full items-center justify-between px-3 mt-4 mb-1 text-[15px] font-medium text-text"
          >
            Workspace
            {workspaceSectionOpen ? (
              <ChevronDown className="h-4 w-4 text-text-subtle" />
            ) : (
              <ChevronRight className="h-4 w-4 text-text-subtle" />
            )}
          </button>
        )}

        {(workspaceSectionOpen || isIconRail) && (
          <div className="flex flex-col gap-0.5">
            <SidebarNavItem href={routes.tasks()} icon={LayoutDashboard} label="Tasks" />
            <SidebarNavItem href={routes.projects()} icon={Layers} label="Projects" />
          </div>
        )}
      </nav>
    </div>
  );

  if (isDrawer) {
    return (
      <>
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 z-sidebar-backdrop bg-black/30 animate-fade-in"
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-sidebar w-[240px] border-r border-border transition-transform duration-200",
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          {content}
        </aside>
      </>
    );
  }

  return (
    <aside
      className={cn(
        "hidden shrink-0 border-r border-border transition-[width] duration-150 md:block",
        isIconRail ? "w-14" : "w-64",
      )}
    >
      {content}
    </aside>
  );
}

interface SidebarNavItemProps {
  href: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
  onNavigate?: () => void;
}

/** A single Tasks/Projects row in the sidebar, with active-state highlight. */
function SidebarNavItem({ href, icon: Icon, label, onNavigate }: SidebarNavItemProps) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-9 w-full items-center gap-2 rounded-xl px-3 text-[15px] font-medium transition-colors",
        active ? "bg-surface-muted text-text" : "text-text-muted hover:bg-surface-muted hover:text-text",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{label}</span>
    </Link>
  );
}

/** Top-of-sidebar workspace identity row: avatar + user name + chevron. */
function WorkspaceSwitcher({ isIconRail }: { isIconRail: boolean }) {
  const user = useAuthStore((s) => s.user);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null!);

  const displayName = user?.name || DEFAULT_WORKSPACE_NAME;
  const avatarUrl = user?.avatarUrl;

  return (
    <div className="relative p-2">
      <button
        ref={anchorRef}
        type="button"
        onClick={() => setProfileMenuOpen((v) => !v)}
        className={cn(
          "flex h-11 w-full items-center gap-2 rounded-sm px-1.5 text-left transition-colors hover:bg-surface-muted hover:text-text",
          profileMenuOpen && "bg-surface-muted text-text"
        )}
      >
        <Avatar name={displayName} src={avatarUrl} size="sm" />
        {!isIconRail && (
          <>
            <span className="flex-1 truncate text-[15px] font-bold text-text">{displayName}</span>
            <ChevronsUpDown className="h-4 w-4 shrink-0 text-text" />
          </>
        )}
      </button>

      <WorkspaceMenu
        open={profileMenuOpen}
        onClose={() => setProfileMenuOpen(false)}
        anchorRef={anchorRef}
      />
    </div>
  );
}

