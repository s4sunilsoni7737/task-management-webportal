"use client";

import { useRef, useState } from "react";
import { AvatarStack } from "../ui/avatar-stack";
import { MemberPicker } from "../ui/member-picker";
import { useMembers } from "../../hooks/useLookups";
import type { Member } from "../../lib/types";

interface TaskMembersCellProps {
  members: Member[];
  /** When omitted, renders read-only (used by mobile row cards). */
  onChange?: (memberIds: string[]) => void;
  size?: "xs" | "sm" | "md";
}

/** Combines AvatarStack (display) with MemberPicker (assignment) — reused across List/Board/Subtasks. */
export function TaskMembersCell({ members = [], onChange, size = "sm" }: TaskMembersCellProps) {
  const { data: allMembers = [] } = useMembers();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null!);

  if (!onChange) {
    return (
      <div onClick={(e) => e.stopPropagation()}>
        <AvatarStack members={members} size={size} />
      </div>
    );
  }

  const handleChange = onChange;

  function toggle(memberId: string) {
    const ids = members.map((m) => m.id);
    handleChange(
      ids.includes(memberId) ? ids.filter((id) => id !== memberId) : [...ids, memberId],
    );
  }

  return (
    <div ref={anchorRef} onClick={(e) => e.stopPropagation()}>
      <AvatarStack members={members} size={size} onAdd={() => setOpen(true)} />
      <MemberPicker
        open={open}
        onClose={() => setOpen(false)}
        anchorRef={anchorRef}
        members={allMembers}
        selectedIds={members.map((m) => m.id)}
        onToggle={toggle}
      />
    </div>
  );
}
