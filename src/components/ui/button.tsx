import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "black" | "outline" | "ghost" | "accent";
type ButtonSize = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  black:
    "bg-black-action text-black-action-fg hover:bg-black-action-hover",
  outline: "border border-border bg-surface text-text hover:bg-accent-soft hover:text-accent hover:border-accent",
  ghost: "text-text hover:bg-accent-soft hover:text-accent",
  accent: "bg-accent text-accent-fg hover:bg-accent-hover",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-8 px-2.5 text-sm gap-1.5",
  md: "h-9 px-3.5 text-sm gap-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "outline", size = "md", type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-sm font-medium transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-bg",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
      {...props}
    />
  );
});
