"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import { cn } from "../../lib/utils";

interface SidebarNavItemProps {
  href: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
  onNavigate?: () => void;
}

/** A single Tasks/Projects row in the sidebar, with active-state highlight. */
export function SidebarNavItem({ href, icon: Icon, label, onNavigate }: SidebarNavItemProps) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-9 items-center gap-2.5 rounded-sm px-2.5 text-sm font-medium transition-colors",
        active
          ? "bg-surface-muted text-text"
          : "text-text-muted hover:bg-surface-muted hover:text-text",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{label}</span>
    </Link>
  );
}
