import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/** Renders "Projects › Design Homepage" style trail; current item is darker per design spec. */
export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1 text-sm">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-1">
            {index > 0 && <ChevronRight className="h-3 w-3 shrink-0 text-text-subtle" />}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="truncate text-text-muted hover:text-text"
              >
                {item.label}
              </Link>
            ) : (
              <span className={cn("truncate", isLast ? "font-medium text-text" : "text-text-muted")}>
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
