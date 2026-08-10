"use client";

import { useRef, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import { Check, ChevronRight, Copy, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { IconButton } from "./icon-button";
import { Popover } from "./popover";
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

/** A single row inside any popover menu — used by WorkspaceMenu, PriorityPopover, OverflowMenu, StatusPopover. */
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

interface OverflowMenuProps {
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  label?: string;
}

/** Reusable three-dot row action menu for Task rows, Project rows, and Subtask rows. */
export function OverflowMenu({ onEdit, onDuplicate, onDelete, label = "Row actions" }: OverflowMenuProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null!);

  return (
    <>
      <IconButton
        ref={triggerRef}
        aria-label={label}
        active={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        <MoreHorizontal className="h-4 w-4" />
      </IconButton>
      <Popover open={open} onClose={() => setOpen(false)} anchorRef={triggerRef} align="end" className="w-[150px] p-1">
        {onEdit && (
          <MenuItem
            icon={Pencil}
            label="Edit"
            onClick={() => {
              onEdit();
              setOpen(false);
            }}
          />
        )}
        {onDuplicate && (
          <MenuItem
            icon={Copy}
            label="Duplicate"
            onClick={() => {
              onDuplicate();
              setOpen(false);
            }}
          />
        )}
        {onDelete && (
          <MenuItem
            icon={Trash2}
            label="Delete"
            destructive
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
          />
        )}
      </Popover>
    </>
  );
}