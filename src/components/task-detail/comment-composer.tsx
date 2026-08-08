"use client";

import { useState } from "react";
import { Paperclip, SendHorizontal } from "lucide-react";
import { Avatar } from "../ui/avatar";
import { useAuthStore } from "../../store/authStore";
import { DEFAULT_WORKSPACE_NAME } from "../../../constants";

interface CommentComposerProps {
  onSubmit: (body: string) => void;
  pending?: boolean;
  placeholder?: string;
  compact?: boolean;
}

/**
 * Full-width bordered comment input with attachment + send icons, ~52px
 * tall, per design_break_down.md §6. Used both as the primary composer and
 * (in compact mode) as the inline reply row.
 */
export function CommentComposer({
  onSubmit,
  pending,
  placeholder = "Add a comment...",
  compact,
}: CommentComposerProps) {
  const user = useAuthStore((s) => s.user);
  const [value, setValue] = useState("");

  function submit() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setValue("");
  }

  return (
    <div className={`flex items-center gap-2.5 rounded-md border border-border bg-surface px-3 ${compact ? "h-10" : "h-[52px]"}`}>
      {compact && <Avatar name={user?.name ?? DEFAULT_WORKSPACE_NAME} size="xs" />}
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        placeholder={placeholder}
        disabled={pending}
        className="min-w-0 flex-1 bg-transparent text-sm text-text outline-none placeholder:text-text-subtle"
      />
      <button
        type="button"
        aria-label="Attach file"
        disabled
        className="flex h-7 w-7 items-center justify-center rounded-sm text-text-subtle disabled:cursor-not-allowed"
      >
        <Paperclip className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        aria-label="Send comment"
        onClick={submit}
        disabled={pending || !value.trim()}
        className="flex h-7 w-7 items-center justify-center rounded-sm text-accent transition-colors hover:bg-accent-soft disabled:cursor-not-allowed disabled:text-text-subtle disabled:hover:bg-transparent"
      >
        <SendHorizontal className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
