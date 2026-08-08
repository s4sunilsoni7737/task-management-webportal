"use client";

import { useRef, useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "./button";
import { Popover } from "./popover";
import { PRIORITY_CONFIG } from "../../lib/utils/enum-utils";
import type { Label, Member, Priority } from "../../lib/types";
import { PRIORITIES } from "../../lib/types";
import { cn } from "../../lib/utils";

export interface TaskFilters {
  memberId: string | null;
  labelId: string | null;
  priority: Priority | null;
}

interface FilterPopoverProps {
  members: Member[];
  labels: Label[];
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
}

const activeFilterCount = (f: TaskFilters) =>
  Number(!!f.memberId) + Number(!!f.labelId) + Number(!!f.priority);

/** "Filter" toolbar control — narrows visible tasks by member, label, or priority. */
export function FilterPopover({ members, labels, filters, onChange }: FilterPopoverProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null!);
  const count = activeFilterCount(filters);

  return (
    <>
      <Button ref={triggerRef} variant="outline" size="sm" onClick={() => setOpen((v) => !v)}>
        <Filter className="h-3.5 w-3.5" />
        Filter
        {count > 0 && (
          <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-fg">
            {count}
          </span>
        )}
      </Button>
      <Popover open={open} onClose={() => setOpen(false)} anchorRef={triggerRef} align="end" className="w-[220px] p-2.5">
        <div className="flex flex-col gap-3">
          <div>
            <p className="mb-1.5 text-xs font-medium text-text-subtle">Priority</p>
            <div className="flex flex-wrap gap-1">
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() =>
                    onChange({ ...filters, priority: filters.priority === p ? null : p })
                  }
                  className={cn(
                    "rounded-sm border px-2 py-1 text-xs",
                    filters.priority === p
                      ? "border-accent bg-accent-soft text-accent"
                      : "border-border text-text-muted hover:bg-surface-muted",
                  )}
                >
                  {PRIORITY_CONFIG[p].label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-text-subtle">Member</p>
            <div className="flex flex-col gap-0.5">
              {members.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() =>
                    onChange({ ...filters, memberId: filters.memberId === m.id ? null : m.id })
                  }
                  className={cn(
                    "rounded-sm px-2 py-1 text-left text-xs",
                    filters.memberId === m.id
                      ? "bg-accent-soft text-accent"
                      : "text-text-muted hover:bg-surface-muted",
                  )}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-text-subtle">Label</p>
            <div className="flex flex-wrap gap-1">
              {labels.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() =>
                    onChange({ ...filters, labelId: filters.labelId === l.id ? null : l.id })
                  }
                  className={cn(
                    "rounded-sm border px-2 py-1 text-xs",
                    filters.labelId === l.id
                      ? "border-accent bg-accent-soft text-accent"
                      : "border-border text-text-muted hover:bg-surface-muted",
                  )}
                >
                  {l.name}
                </button>
              ))}
            </div>
          </div>

          {count > 0 && (
            <button
              type="button"
              onClick={() => onChange({ memberId: null, labelId: null, priority: null })}
              className="text-left text-xs text-accent hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      </Popover>
    </>
  );
}
