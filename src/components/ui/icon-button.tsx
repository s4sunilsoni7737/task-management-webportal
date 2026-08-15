import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  "aria-label": string;
  active?: boolean;
}

/** Square icon-only button, ~32x32px hit area, per design_break_down.md §2.5. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { className, active, type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-sm text-text-muted transition-colors",
        "hover:bg-accent-soft hover:text-accent",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        "disabled:cursor-not-allowed disabled:opacity-50",
        active && "bg-accent-soft text-accent",
        className,
      )}
      {...props}
    />
  );
});
