"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

interface CollapsiblePanelProps {
  title: ReactNode;
  count?: number;
  defaultOpen?: boolean;
  headerRight?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Generic collapse/expand section used for Task Status groups, the
 * Subtasks section, and the right Details/Updates cards.
 */
export function CollapsiblePanel({
  title,
  count,
  defaultOpen = true,
  headerRight,
  children,
  className,
}: CollapsiblePanelProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={className}>
      <div className="mb-2 flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1.5 text-sm font-semibold text-text"
        >
          {open ? (
            <ChevronDown className="h-3.5 w-3.5 text-text-subtle" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 text-text-subtle" />
          )}
          {title}
          {typeof count === "number" && (
            <span className="text-xs font-normal text-text-subtle">{count}</span>
          )}
        </button>
        {headerRight && <div className="ml-auto">{headerRight}</div>}
      </div>
      {open && <div className={cn("animate-fade-in")}>{children}</div>}
    </div>
  );
}
