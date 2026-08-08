import { cn } from "../../lib/utils";

export function GlobalLoader({ className }: { className?: string }) {
  return (
    <div className={cn("flex h-full w-full items-center justify-center bg-bg", className)}>
      <div
        className="h-5 w-5 animate-spin rounded-full border-2 border-border-strong border-t-accent"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
