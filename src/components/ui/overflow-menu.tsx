"use client";

import { useRef, useState } from "react";
import { MoreHorizontal, Pencil, Copy, Trash2 } from "lucide-react";
import { IconButton } from "./icon-button";
import { Popover } from "./popover";
import { MenuItem } from "./menu-item";

interface OverflowMenuProps {
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  label?: string;
}

/** Reusable three-dot row action menu for Task rows, Project rows, and Subtask rows. */
export function OverflowMenu({ onEdit, onDuplicate, onDelete, label = "Row actions" }: OverflowMenuProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null!);

  return (
    <>
      <IconButton
        ref={triggerRef}
        aria-label={label}
        active={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        <MoreHorizontal className="h-4 w-4" />
      </IconButton>
      <Popover open={open} onClose={() => setOpen(false)} anchorRef={triggerRef} align="end" className="w-[150px] p-1">
        {onEdit && (
          <MenuItem
            icon={Pencil}
            label="Edit"
            onClick={() => {
              onEdit();
              setOpen(false);
            }}
          />
        )}
        {onDuplicate && (
          <MenuItem
            icon={Copy}
            label="Duplicate"
            onClick={() => {
              onDuplicate();
              setOpen(false);
            }}
          />
        )}
        {onDelete && (
          <MenuItem
            icon={Trash2}
            label="Delete"
            destructive
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
          />
        )}
      </Popover>
    </>
  );
}
