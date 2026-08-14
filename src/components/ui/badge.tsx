import { CalendarDays, X, Tag } from "lucide-react";
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
        "inline-flex h-[24px] items-center gap-1.5 rounded-full bg-surface-muted px-2.5 text-[11px] font-medium text-text",
        className,
      )}
    >
      <Tag className="h-3 w-3 shrink-0 text-text-muted" />
      {label.name}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${label.name} label`}
          className="ml-0.5 rounded-full text-text-muted hover:text-text transition-colors"
        >
          <X className="h-3 w-3" />
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
          "inline-flex h-[24px] items-center gap-1.5 rounded-full border border-dashed border-border px-2.5 text-[11px] font-medium text-text-muted transition-colors hover:border-accent hover:text-accent",
          className,
        )}
      >
        <CalendarDays className="h-3 w-3 shrink-0" />
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
        "inline-flex h-[24px] items-center gap-1.5 rounded-full px-2.5 text-[11px] font-medium transition-opacity hover:opacity-80",
        isOverdue ? "bg-red-50 text-red-600" : "bg-surface-muted text-text-muted",
        className,
      )}
    >
      <CalendarDays className="h-3 w-3 shrink-0" />
      {label}
    </button>
  );
}