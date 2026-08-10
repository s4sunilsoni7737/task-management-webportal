"use client";

import { Popover } from "../ui/popover";
import { MenuItem } from "../ui/menu";
import { PRIORITY_CONFIG } from "../../lib/utils/enum-utils";
import { PRIORITIES, type Priority } from "../../lib/types";

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
    <Popover open={open} onClose={onClose} anchorRef={anchorRef} align="start" className="w-[170px] p-1">
      <p className="px-2.5 py-1.5 text-xs font-medium text-text-subtle">Priority</p>
      {PRIORITIES.map((priority) => {
        const config = PRIORITY_CONFIG[priority];
        return (
          <MenuItem
            key={priority}
            iconNode={
              <config.icon
                className="h-3.5 w-3.5 shrink-0"
                style={{ color: `var(${config.colorVar})` } as React.CSSProperties}
              />
            }
            label={config.label}
            selected={value === priority}
            onClick={() => {
              onChange(priority);
              onClose();
            }}
          />
        );
      })}
    </Popover>
  );
}
