import { cn } from "../../lib/utils";

interface SkeletonProps {
  className?: string;
  lines?: number;
}

/**
 * Reusable pulse placeholder (replaces ad-hoc inline `animate-pulse` divs).
 */
export function Skeleton({ className, lines }: SkeletonProps) {
  if (lines !== undefined) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: lines }, (_, i) => (
          <div key={i} className={cn("h-4 animate-pulse rounded-sm bg-surface-muted", className)} />
        ))}
      </div>
    );
  }
  return <div className={cn("animate-pulse rounded-sm bg-surface-muted", className)} />;
}