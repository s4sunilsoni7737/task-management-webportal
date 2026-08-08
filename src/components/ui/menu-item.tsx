import type { ComponentType, ReactNode } from "react";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

interface MenuItemProps {
  icon?: ComponentType<{ className?: string }>;
  iconNode?: ReactNode;
  label: string;
  onClick?: () => void;
  selected?: boolean;
  hasSubmenu?: boolean;
  destructive?: boolean;
  className?: string;
}

/** A single row inside any popover menu — used by WorkspaceMenu, ThemeSubmenu, ColorModeSubmenu, PriorityPopover, OverflowMenu, StatusPopover. */
export function MenuItem({
  icon: Icon,
  iconNode,
  label,
  onClick,
  selected,
  hasSubmenu,
  destructive,
  className,
}: MenuItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={cn(
        "flex h-8 w-full items-center gap-2 rounded-sm px-2.5 text-left text-sm transition-colors",
        "hover:bg-surface-muted focus-visible:outline-none focus-visible:bg-surface-muted",
        destructive ? "text-priority-high" : "text-text",
        className,
      )}
    >
      {iconNode}
      {Icon && <Icon className="h-3.5 w-3.5 shrink-0 text-text-muted" />}
      <span className="flex-1 truncate">{label}</span>
      {selected && <Check className="h-3.5 w-3.5 shrink-0 text-accent" />}
      {hasSubmenu && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-text-subtle" />}
    </button>
  );
}
