import { CalendarDays, X } from "lucide-react";
import { PRIORITY_CONFIG, STATUS_CONFIG } from "@/lib/utils/enum-utils";
import { formatDate, formatDateShort } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils";
import type { Label, Priority, TaskStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

/** Compact status indicator reused for Board column headers and the Details panel Status dropdown. */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <span
      className={cn("inline-flex items-center gap-1.5 text-sm", className)}
      style={{ color: `var(${config.colorVar})` }}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate">{config.label}</span>
    </span>
  );
}

interface PriorityBadgeProps {
  priority: Priority;
  showLabel?: boolean;
  className?: string;
}

/** Compact priority indicator reused in List rows, Board cards, and the Details panel dropdown. */
export function PriorityBadge({ priority, showLabel = true, className }: PriorityBadgeProps) {
  const config = PRIORITY_CONFIG[priority];
  const Icon = config.icon;

  return (
    <span
      className={cn("inline-flex items-center gap-1.5 text-sm", className)}
      style={{ color: `var(${config.colorVar})` }}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />
      {showLabel && <span className="truncate">{config.label}</span>}
    </span>
  );
}

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

interface DateChipProps {
  date: string | null;
  short?: boolean;
  onClick?: () => void;
  className?: string;
}

/** Compact date chip used in task rows, cards, and the Properties row on Task Detail. */
export function DateChip({ date, short, onClick, className }: DateChipProps) {
  if (!date) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-sm border border-dashed border-border-strong px-2 py-1 text-xs text-text-subtle transition-colors hover:border-accent hover:text-accent",
          className,
        )}
      >
        <CalendarDays className="h-3 w-3" />
        Set date
      </button>
    );
  }

  const isOverdue = new Date(date) < new Date(new Date().toDateString());
  const label = short ? formatDateShort(date) : formatDate(date);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-xs font-medium transition-opacity hover:opacity-80",
        isOverdue ? "bg-danger-soft text-danger" : "bg-surface-muted text-text-muted",
        className,
      )}
    >
      <CalendarDays className="h-3 w-3" />
      {label}
    </button>
  );
}