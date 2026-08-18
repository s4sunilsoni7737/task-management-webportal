import { cn } from "@/lib/utils";

export function GlobalLoader({ className }: { className?: string }) {
  return (
    <div className={cn("flex h-full w-full flex-col items-center justify-center gap-4 bg-bg", className)}>
      <div
        className="h-10 w-10 animate-spin rounded-full border-[3px] border-border border-t-accent"
        role="status"
        aria-label="Loading"
      />
      <p className="text-[15px] font-medium text-text-muted animate-pulse">Loading...</p>
    </div>
  );
}
