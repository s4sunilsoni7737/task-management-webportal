import { STATUS_CONFIG } from "../../lib/utils/enum-utils";
import type { TaskStatus } from "../../lib/types";
import { cn } from "../../lib/utils";

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
      className={cn("inline-flex items-center gap-1.5 text-sm font-medium", className)}
      style={{ color: `var(${config.colorVar})` }}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate">{config.label}</span>
    </span>
  );
}
