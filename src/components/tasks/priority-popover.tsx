"use client";

import { Check } from "lucide-react";
import { Popover } from "@/components/ui/popover";
import { MenuItem } from "@/components/ui/menu";
import { PRIORITY_CONFIG } from "@/lib/utils/enum-utils";
import { PRIORITIES, type Priority } from "@/lib/types";

interface PriorityPopoverProps {
  open: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement>;
  value: Priority;
  onChange: (priority: Priority) => void;
}

/**
 * Priority selector popover — No Priority, Urgent, High, Medium, Low —
 * reused by Task rows/cards and the Details panel Priority field, per
 * design_break_down.md §8.
 */
export function PriorityPopover({ open, onClose, anchorRef, value, onChange }: PriorityPopoverProps) {
  return (
    <Popover open={open} onClose={onClose} anchorRef={anchorRef} align="start" className="w-[180px] p-1.5">
      <div className="flex flex-col gap-0.5">
        <div className="px-2.5 py-1 text-xs text-text-muted">Priority</div>
        {PRIORITIES.map((priority) => {
          const config = PRIORITY_CONFIG[priority];
          const isSelected = value === priority;
          
          if (priority === "no_priority") {
            return (
              <button
                key={priority}
                onClick={() => {
                  onChange(priority);
                  onClose();
                }}
                className="flex items-center gap-2 rounded-sm px-2.5 py-1.5 text-sm hover:bg-surface-muted transition-colors text-text"
              >
                <div className="flex h-4 w-4 items-center justify-center shrink-0">
                  <div className="h-1.5 w-1.5 rounded-full border border-text-subtle" />
                </div>
                <span className="flex-1 text-left text-text">No Priority</span>
                {isSelected && <Check className="h-4 w-4 text-text shrink-0" />}
              </button>
            );
          }

          const Icon = config.icon;
          return (
            <button
              key={priority}
              onClick={() => {
                onChange(priority);
                onClose();
              }}
              className="flex items-center gap-2 rounded-sm px-2.5 py-1.5 text-sm hover:bg-surface-muted transition-colors text-text"
            >
              <Icon className="h-4 w-4 shrink-0" style={{ color: `var(${config.colorVar})` }} />
              <span className="flex-1 text-left" style={{ color: `var(${config.colorVar})` }}>{config.label}</span>
              {isSelected && <Check className="h-4 w-4 text-text shrink-0" />}
            </button>
          );
        })}
      </div>
    </Popover>
  );
}
