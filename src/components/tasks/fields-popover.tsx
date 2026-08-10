"use client";

import { useRef, useState } from "react";
import { Check, Columns3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover } from "@/components/ui/popover";

export interface FieldOption {
  key: string;
  label: string;
}

interface FieldsPopoverProps {
  options: FieldOption[];
  visible: Record<string, boolean>;
  onToggle: (key: string) => void;
}

/**
 * "Fields" toolbar control â€” checklist popover to show/hide table columns
 * (Priority, Members, Due Date, Labels, Status, Reporter), per Scope of
 * Work Â§3.4.
 */
export function FieldsPopover({ options, visible, onToggle }: FieldsPopoverProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null!);

  return (
    <>
      <Button ref={triggerRef} variant="outline" size="sm" onClick={() => setOpen((v) => !v)}>
        <Columns3 className="h-3.5 w-3.5" />
        Fields
      </Button>
      <Popover open={open} onClose={() => setOpen(false)} anchorRef={triggerRef} align="end" className="w-[180px] p-1">
        {options.map((option) => (
          <button
            key={option.key}
            type="button"
            role="menuitemcheckbox"
            aria-checked={visible[option.key] ?? true}
            onClick={() => onToggle(option.key)}
            className="flex h-8 w-full items-center gap-2 rounded-sm px-2.5 text-left text-sm text-text transition-colors hover:bg-surface-muted"
          >
            <span
              className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[3px] border ${
                visible[option.key] ?? true
                  ? "border-accent bg-accent text-accent-fg"
                  : "border-border-strong"
              }`}
            >
              {(visible[option.key] ?? true) && <Check className="h-2.5 w-2.5" />}
            </span>
            <span className="flex-1 truncate">{option.label}</span>
          </button>
        ))}
      </Popover>
    </>
  );
}
