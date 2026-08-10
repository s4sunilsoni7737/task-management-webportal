import type { ComponentType, ReactNode } from "react";

interface DetailRowProps {
  icon: ComponentType<{ className?: string }>;
  label: string;
  children: ReactNode;
}

/** Generic left icon/label + right value row, reused for every field in the Details card. */
export function DetailRow({ icon: Icon, label, children }: DetailRowProps) {
  return (
    <div className="flex min-h-[34px] items-center gap-2 py-1">
      <div className="flex w-24 shrink-0 items-center gap-1.5 text-xs text-text-subtle">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
