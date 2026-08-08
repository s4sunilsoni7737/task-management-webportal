import type { ComponentType, ReactNode } from "react";

interface EmptyStateProps {
  icon?: ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: ReactNode;
}

/** Reusable empty state for search-with-no-results, empty groups, empty tabs, etc. */
export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
      {Icon && <Icon className="h-6 w-6 text-text-subtle" />}
      <p className="text-sm font-medium text-text">{title}</p>
      {description && <p className="max-w-xs text-xs text-text-muted">{description}</p>}
      {action}
    </div>
  );
}
