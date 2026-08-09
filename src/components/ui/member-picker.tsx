"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Popover } from "./popover";
import { Avatar } from "./avatar";
import type { Member } from "../../lib/types";

interface MemberPickerProps {
  open: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement>;
  members: Member[];
  selectedIds: string[];
  onToggle: (memberId: string) => void;
}

/** Popover member picker used by AvatarStack "+" triggers and the Details panel Members field. */
export function MemberPicker({
  open,
  onClose,
  anchorRef,
  members,
  selectedIds,
  onToggle,
}: MemberPickerProps) {
  const [query, setQuery] = useState("");
  const filtered = members.filter((m) => m.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <Popover open={open} onClose={onClose} anchorRef={anchorRef} align="start" className="w-[220px] p-1">
      <div className="p-1.5 pb-1">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search members..."
          autoFocus
          className="h-7 w-full rounded-sm border border-border bg-surface px-2 text-sm text-text outline-none focus:border-accent"
        />
      </div>
      <div className="max-h-52 overflow-y-auto scrollbar-thin">
        {filtered.length === 0 && (
          <p className="px-2.5 py-2 text-xs text-text-subtle">No members found</p>
        )}
        {filtered.map((member) => {
          const selected = selectedIds.includes(member.id);
          return (
            <button
              key={member.id}
              type="button"
              onClick={() => onToggle(member.id)}
              className="flex h-8 w-full items-center gap-2 rounded-sm px-2.5 text-left text-sm text-text transition-colors hover:bg-surface-muted"
            >
              <Avatar name={member.name} size="xs" />
              <span className="flex-1 truncate">{member.name}</span>
              {selected && <Check className="h-3.5 w-3.5 shrink-0 text-accent" />}
            </button>
          );
        })}
      </div>
    </Popover>
  );
}
