"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

const PAGE_SIZE_OPTIONS = [10, 20, 50];

/** Windowed page-number range with ellipsis, mirroring the senior data-table pattern. */
function pageRange(current: number, totalPages: number): (number | "…")[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "…", totalPages];
  if (current >= totalPages - 3)
    return [1, "…", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  return [1, "…", current - 1, current, current + 1, "…", totalPages];
}

/**
 * Compact, responsive pagination matching the Dexter aesthetic. Prev/next +
 * page numbers on ≥sm; a minimal "x of y" readout on mobile. Sits in the
 * bordered, rounded footer below a list/table.
 */
export function Pagination({
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = PAGE_SIZE_OPTIONS,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const range = pageRange(page, totalPages);
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-md border border-border bg-surface px-3 py-2">
      <div className="flex items-center gap-2 text-xs text-text-muted">
        <span className="hidden sm:inline">
          {from}–{to} of {total}
        </span>
        <span className="sm:hidden">
          {page} of {totalPages}
        </span>
        {onPageSizeChange && (
          <div className="relative ml-1 hidden items-center gap-1.5 sm:flex">
            <span>Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                onPageChange(1);
                onPageSizeChange(Number(e.target.value));
              }}
              className="h-7 appearance-none rounded-sm border border-border bg-surface px-2 pr-6 text-xs text-text outline-none focus:border-accent"
              aria-label="Rows per page"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <ChevronRight className="pointer-events-none absolute right-1.5 h-3 w-3 -rotate-90 text-text-subtle" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="flex h-7 w-7 items-center justify-center rounded-sm text-text transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="hidden items-center gap-1 sm:flex">
          {range.map((n, i) =>
            n === "…" ? (
              <span key={`dots-${i}`} className="flex h-7 w-7 items-center justify-center text-xs text-text-subtle">
                …
              </span>
            ) : (
              <button
                key={n}
                type="button"
                onClick={() => onPageChange(n)}
                aria-current={n === page ? "page" : undefined}
                className={cn(
                  "flex h-7 min-w-7 items-center justify-center rounded-sm px-1.5 text-xs font-medium transition-colors",
                  n === page
                    ? "bg-accent text-accent-fg"
                    : "text-text-muted hover:bg-surface-muted hover:text-text",
                )}
              >
                {n}
              </button>
            ),
          )}
        </div>

        <button
          type="button"
          aria-label="Next page"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="flex h-7 w-7 items-center justify-center rounded-sm text-text transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}