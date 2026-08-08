import { List, LayoutGrid } from "lucide-react";
import { cn } from "../../lib/utils";

interface ViewToggleProps {
  value: "list" | "board";
  onChange: (value: "list" | "board") => void;
}

/** List ↔ Board segmented toggle, per Scope of Work §3.4. */
export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div className="flex h-8 items-center rounded-sm border border-border bg-surface p-0.5">
      {(
        [
          { key: "list", label: "List", icon: List },
          { key: "board", label: "Board", icon: LayoutGrid },
        ] as const
      ).map((opt) => (
        <button
          key={opt.key}
          type="button"
          onClick={() => onChange(opt.key)}
          className={cn(
            "flex h-full items-center gap-1.5 rounded-[4px] px-2.5 text-sm font-medium transition-colors",
            value === opt.key ? "bg-surface-muted text-text" : "text-text-muted hover:text-text",
          )}
        >
          <opt.icon className="h-3.5 w-3.5" />
          {opt.label}
        </button>
      ))}
    </div>
  );
}
