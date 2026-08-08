import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  breadcrumb?: ReactNode;
  toolbar?: ReactNode;
}

/** Page title + right-aligned toolbar row, per design_break_down.md §4/§5. */
export function PageHeader({ title, breadcrumb, toolbar }: PageHeaderProps) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div>
        {breadcrumb}
        <h1 className="text-xl font-bold text-text">{title}</h1>
      </div>
      {toolbar && <div className="flex flex-wrap items-center gap-2">{toolbar}</div>}
    </div>
  );
}
