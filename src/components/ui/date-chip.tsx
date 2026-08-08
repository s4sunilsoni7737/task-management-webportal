import { CalendarDays } from "lucide-react";
import { formatDate, formatDateShort } from "../../lib/utils/formatters";
import { cn } from "../../lib/utils";

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
