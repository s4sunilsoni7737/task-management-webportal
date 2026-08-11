"use client";

import { useState, useRef } from "react";
import { Plus } from "lucide-react";

interface InlineAddTaskRowProps {
  onAdd: (title: string) => void;
  label?: string;
  pending?: boolean;
}

/** "+ Add Task" row used at the end of every group/column/subtasks table. */
export function InlineAddTaskRow({ onAdd, label = "Add Task", pending }: InlineAddTaskRowProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const submittingRef = useRef(false);

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    if (submittingRef.current) return;
    
    const trimmed = title.trim();
    if (!trimmed) {
      setEditing(false);
      setTitle("");
      return;
    }

    submittingRef.current = true;
    try {
      await onAdd(trimmed);
      setTitle("");
      setEditing(false);
    } catch (err) {
      // Error handled by mutation
    } finally {
      // Reset ref after a short delay to allow for unmount/remount cycles
      setTimeout(() => {
        submittingRef.current = false;
      }, 100);
    }
  }

  if (editing) {
    return (
      <form onSubmit={submit} className="w-full">
        <input
          autoFocus
          value={title}
          disabled={pending}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => submit()}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setTitle("");
              setEditing(false);
            }
          }}
          placeholder="Task name..."
          className="h-8 w-full rounded-sm border border-accent bg-surface px-2.5 text-sm text-text outline-none"
        />
      </form>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        setEditing(true);
        submittingRef.current = false;
      }}
      className="flex h-8 w-full items-center gap-1.5 rounded-sm px-2.5 text-left text-sm text-text-subtle transition-colors hover:bg-surface-muted hover:text-text"
    >
      <Plus className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}
