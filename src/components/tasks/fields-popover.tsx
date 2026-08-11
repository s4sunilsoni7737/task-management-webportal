"use client";

import { useRef, useState } from "react";
import { Check, Columns3, AlignJustify } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface FieldOption {
  key: string;
  label: string;
}

interface FieldsPopoverProps {
  options: FieldOption[];
  visible: Record<string, boolean>;
  onToggle: (key: string) => void;
  view?: "list" | "board";
  onViewChange?: (view: "list" | "board") => void;
}

/**
 * "Fields" toolbar control — checklist popover to show/hide table columns
 */
export function FieldsPopover({ options, visible, onToggle, view, onViewChange }: FieldsPopoverProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null!);

  return (
    <>
      <Button ref={triggerRef} variant="outline" size="sm" onClick={() => setOpen((v) => !v)} className="h-8 rounded-md px-2.5 font-medium">
        <Columns3 className="h-4 w-4 mr-1.5 text-text" />
        Fields
      </Button>
      <Popover open={open} onClose={() => setOpen(false)} anchorRef={triggerRef} align="end" className="w-[200px] p-2">
        {view && onViewChange && (
          <div className="flex items-center rounded-md bg-surface-muted p-1 mb-2">
            <button
              onClick={() => onViewChange("list")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 rounded-[4px] py-1 text-sm font-medium transition-colors",
                view === "list" ? "bg-surface shadow-sm text-text" : "text-text-subtle hover:text-text"
              )}
            >
              <AlignJustify className="h-4 w-4" />
              List
            </button>
            <button
              onClick={() => onViewChange("board")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 rounded-[4px] py-1 text-sm font-medium transition-colors",
                view === "board" ? "bg-surface shadow-sm text-text" : "text-text-subtle hover:text-text"
              )}
            >
              <Columns3 className="h-4 w-4" />
              Board
            </button>
          </div>
        )}
        
        <div className="flex flex-col">
          {options.map((option) => (
            <button
              key={option.key}
              type="button"
              role="menuitemcheckbox"
              aria-checked={visible[option.key] ?? true}
              onClick={() => onToggle(option.key)}
              className="flex h-8 w-full items-center justify-between gap-2 rounded-sm px-2.5 text-left text-sm text-text transition-colors hover:bg-surface-muted"
            >
              <span className="flex-1 truncate">{option.label}</span>
              <span
                className={cn(
                  "flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px]",
                  (visible[option.key] ?? true)
                    ? "bg-black-action text-black-action-fg"
                    : "bg-surface-muted border border-border"
                )}
              >
                {(visible[option.key] ?? true) && <Check className="h-3 w-3" strokeWidth={3} />}
              </span>
            </button>
          ))}
        </div>
      </Popover>
    </>
  );
}
