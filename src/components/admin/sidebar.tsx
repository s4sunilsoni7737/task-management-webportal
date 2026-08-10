"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import { Briefcase, ChevronDown, ChevronRight, ChevronsUpDown, ClipboardList } from "lucide-react";
import { WorkspaceMenu } from "./workspace-menu";
import { Avatar } from "../ui/avatar";
import { useAuthStore } from "../../store/authStore";
import { useUiStore } from "../../store/uiStore";
import { useWorkspaces } from "../../hooks/useWorkspaces";
import { routes } from "../../lib/routeBuilder";
import { cn } from "../../lib/utils";
import { DEFAULT_WORKSPACE_NAME } from "../../../constants";

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
      <WorkspaceSwitcher />

      <nav className="flex-1 overflow-y-auto scrollbar-thin px-2.5 pt-2">
        {!isIconRail && (
          <button
            type="button"
            onClick={() => setWorkspaceSectionOpen((v) => !v)}
            className="flex h-7 w-full items-center gap-1 px-1 text-xs font-medium text-text-subtle"
          >
            {workspaceSectionOpen ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
            Workspace
          </button>
        )}

        {(workspaceSectionOpen || isIconRail) && (
          <div className="flex flex-col gap-0.5">
            <SidebarNavItem href={routes.tasks()} icon={ClipboardList} label="Tasks" />
            <SidebarNavItem href={routes.projects()} icon={Briefcase} label="Projects" />
          </div>
        )}
      </nav>

      <div className="border-t border-border p-2">
        <button
          ref={userBlockRef}
          type="button"
          onClick={() => setProfileMenuOpen((v) => !v)}
          className={cn(
            "flex h-11 w-full items-center gap-2 rounded-sm px-1.5 text-left transition-colors hover:bg-surface-muted",
            profileMenuOpen && "bg-surface-muted",
          )}
        >
          <Avatar name={user?.name ?? DEFAULT_WORKSPACE_NAME} size="sm" />
          {!isIconRail && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-text">
                {user?.name ?? DEFAULT_WORKSPACE_NAME}
              </p>
              <p className="truncate text-xs text-text-subtle">
                {user?.email ?? "Guest session"}
              </p>
            </div>
          )}
        </button>

        <WorkspaceMenu
          open={profileMenuOpen}
          onClose={() => setProfileMenuOpen(false)}
          anchorRef={userBlockRef}
        />
      </div>
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
        isIconRail ? "w-14" : "w-[210px]",
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
        "flex h-9 items-center gap-2.5 rounded-sm px-2.5 text-sm font-medium transition-colors",
        active ? "bg-surface-muted text-text" : "text-text-muted hover:bg-surface-muted hover:text-text",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{label}</span>
    </Link>
  );
}

/** Top-of-sidebar workspace identity row: avatar + workspace name + chevron. */
function WorkspaceSwitcher() {
  const { data: workspaces, isLoading } = useWorkspaces();

  const activeWorkspace = workspaces?.[0];
  const displayName = activeWorkspace?.name || DEFAULT_WORKSPACE_NAME;
  const avatarUrl = activeWorkspace?.avatarUrl;

  return (
    <button type="button" className="flex h-12 w-full items-center gap-2 px-4 text-left transition-colors hover:bg-surface-muted">
      <Avatar name={displayName} src={avatarUrl} size="sm" className="rounded-md" />
      <span className="flex-1 truncate text-sm font-semibold text-text">{isLoading ? "Loading..." : displayName}</span>
      <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-text-subtle" />
    </button>
  );
}

