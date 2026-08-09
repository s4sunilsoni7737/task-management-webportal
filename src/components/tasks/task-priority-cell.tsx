"use client";

import { useRef, useState } from "react";
import { PriorityBadge } from "../ui/priority-badge";
import { PriorityPopover } from "./priority-popover";
import type { Priority } from "../../lib/types";

interface TaskPriorityCellProps {
  value: Priority;
  /** When omitted, renders read-only (used by mobile row cards). */
  onChange?: (priority: Priority) => void;
  showLabel?: boolean;
}

export function TaskPriorityCell({ value, onChange, showLabel = true }: TaskPriorityCellProps) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null!);

  if (onChange) {
    return (
      <>
        <button
          ref={anchorRef}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOpen((v) => !v);
          }}
          className="rounded-sm px-1.5 py-1 transition-colors hover:bg-surface-muted"
        >
          <PriorityBadge priority={value} showLabel={showLabel} />
        </button>
        <PriorityPopover
          open={open}
          onClose={() => setOpen(false)}
          anchorRef={anchorRef}
          value={value}
          onChange={onChange}
        />
      </>
    );
  }

  return <PriorityBadge priority={value} showLabel={showLabel} />;
}
