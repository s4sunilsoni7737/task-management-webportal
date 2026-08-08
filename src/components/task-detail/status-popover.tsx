"use client";

import { Popover } from "../ui/popover";
import { MenuItem } from "../ui/menu-item";
import { STATUS_CONFIG } from "../../lib/utils/enum-utils";
import { TASK_STATUSES, type TaskStatus } from "../../lib/types";

interface StatusPopoverProps {
  open: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement>;
  value: TaskStatus;
  onChange: (status: TaskStatus) => void;
}

/** Status selector popover — To Do, Doing, Completed, On Hold — for the Details panel Status field. */
export function StatusPopover({ open, onClose, anchorRef, value, onChange }: StatusPopoverProps) {
  return (
    <Popover open={open} onClose={onClose} anchorRef={anchorRef} align="start" className="w-[170px] p-1">
      <p className="px-2.5 py-1.5 text-xs font-medium text-text-subtle">Status</p>
      {TASK_STATUSES.map((status) => {
        const config = STATUS_CONFIG[status];
        return (
          <MenuItem
            key={status}
            iconNode={
              <config.icon
                className="h-3.5 w-3.5 shrink-0"
                style={{ color: `var(${config.colorVar})` }}
              />
            }
            label={config.label}
            selected={value === status}
            onClick={() => {
              onChange(status);
              onClose();
            }}
          />
        );
      })}
    </Popover>
  );
}
