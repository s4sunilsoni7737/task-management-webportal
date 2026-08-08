"use client";

import { Check } from "lucide-react";
import { Popover } from "../ui/popover";
import { Avatar } from "../ui/avatar";
import type { Member } from "../../lib/types";

interface ReporterPickerProps {
  open: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement>;
  members: Member[];
  selectedId: string | null;
  onSelect: (memberId: string) => void;
}

/** Single-select member popover for the Details panel Reporter field. */
export function ReporterPicker({ open, onClose, anchorRef, members, selectedId, onSelect }: ReporterPickerProps) {
  return (
    <Popover open={open} onClose={onClose} anchorRef={anchorRef} align="start" className="w-[190px] p-1">
      <p className="px-2.5 py-1.5 text-xs font-medium text-text-subtle">Reporter</p>
      {members.map((member) => (
        <button
          key={member.id}
          type="button"
          onClick={() => {
            onSelect(member.id);
            onClose();
          }}
          className="flex h-8 w-full items-center gap-2 rounded-sm px-2.5 text-left text-sm text-text transition-colors hover:bg-surface-muted"
        >
          <Avatar name={member.name} size="xs" />
          <span className="flex-1 truncate">{member.name}</span>
          {selectedId === member.id && <Check className="h-3.5 w-3.5 shrink-0 text-accent" />}
        </button>
      ))}
    </Popover>
  );
}
