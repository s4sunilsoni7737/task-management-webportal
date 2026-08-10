import { cn } from "@/lib/utils";

export function PyramidMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-md bg-black-action text-white dark:text-[#0a0a0a]",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className="h-[55%] w-[55%]" fill="none">
        <path d="M12 3L21 19H3L12 3Z" fill="currentColor" />
        <path d="M12 3L16.5 19H7.5L12 3Z" fill="currentColor" fillOpacity="0.45" />
      </svg>
    </div>
  );
}
