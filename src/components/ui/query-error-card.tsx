"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { getErrorMessage } from "../../services/api/api-error-handler";

interface QueryErrorCardProps {
  error: unknown;
  title?: string;
  onRetry?: () => void;
}

/**
 * Standard error surface for failed React Query loads — mirrors the senior
 * project's `query-error-card.tsx`. Shows the normalized backend message
 * (`userMessage`/`developerMessage`) with a retry action.
 */
export function QueryErrorCard({ error, title = "Couldn't load data", onRetry }: QueryErrorCardProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-md border border-border bg-surface px-6 py-10 text-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-danger-soft">
        <AlertCircle className="h-5 w-5 text-danger" />
      </span>
      <div>
        <p className="text-sm font-semibold text-text">{title}</p>
        <p className="mt-1 max-w-md text-xs text-text-muted">{getErrorMessage(error)}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="flex items-center gap-1.5 rounded-sm border border-border px-3 py-1.5 text-xs font-medium text-text transition-colors hover:bg-surface-muted"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Try again
        </button>
      )}
    </div>
  );
}