import { X } from "lucide-react";
import type { Label } from "../../lib/types";
import { cn } from "../../lib/utils";

interface LabelChipProps {
  label: Label;
  onRemove?: () => void;
  className?: string;
}

/** Pill-style label chip, per design_break_down.md §6 (Research, Design, Development, ...). */
export function LabelChip({ label, onRemove, className }: LabelChipProps) {
  return (
    <span
      className={cn(
        "inline-flex h-[22px] items-center gap-1 rounded-full bg-surface-muted px-2 text-xs text-text-muted",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: label.color }} />
      {label.name}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${label.name} label`}
          className="ml-0.5 rounded-full hover:text-text"
        >
          <X className="h-2.5 w-2.5" />
        </button>
      )}
    </span>
  );
}
