"use client";

import { Check } from "lucide-react";
import { Popover } from "../../../../components/ui/popover";
import type { Label } from "../../../../lib/types";

interface LabelPickerProps {
  open: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement>;
  labels: Label[];
  selectedIds: string[];
  onToggle: (labelId: string) => void;
}

/** Popover label picker used by the Labels row's "+" trigger. */
export function LabelPicker({ open, onClose, anchorRef, labels, selectedIds, onToggle }: LabelPickerProps) {
  return (
    <Popover open={open} onClose={onClose} anchorRef={anchorRef} align="start" className="w-[180px] p-1">
      <p className="px-2.5 py-1.5 text-xs font-medium text-text-subtle">Labels</p>
      {labels.map((label) => {
        const selected = selectedIds.includes(label.id);
        return (
          <button
            key={label.id}
            type="button"
            onClick={() => onToggle(label.id)}
            className="flex h-8 w-full items-center gap-2 rounded-sm px-2.5 text-left text-sm text-text transition-colors hover:bg-surface-muted"
          >
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: label.color }} />
            <span className="flex-1 truncate">{label.name}</span>
            {selected && <Check className="h-3.5 w-3.5 shrink-0 text-accent" />}
          </button>
        );
      })}
    </Popover>
  );
}
