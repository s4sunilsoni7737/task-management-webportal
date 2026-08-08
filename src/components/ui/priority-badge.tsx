import { PRIORITY_CONFIG } from "../../lib/utils/enum-utils";
import type { Priority } from "../../lib/types";
import { cn } from "../../lib/utils";

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
