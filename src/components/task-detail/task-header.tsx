"use client";

import { useState } from "react";
import type { Task, UpdateTaskInput } from "../../lib/types";

interface TaskHeaderProps {
  task: Task;
  onSave: (input: UpdateTaskInput) => void;
}

/** Editable task title + description, per design_break_down.md §6 "Task header". */
export function TaskHeader({ task, onSave }: TaskHeaderProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  return (
    <div className="mb-5">
      <textarea
        value={title}
        rows={1}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={() => {
          if (title.trim() && title !== task.title) onSave({ title: title.trim() });
          else setTitle(task.title);
        }}
        className="w-full resize-none overflow-hidden border-none bg-transparent text-xl font-bold text-text outline-none"
      />
      <textarea
        value={description}
        rows={2}
        placeholder="Add a description..."
        onChange={(e) => setDescription(e.target.value)}
        onBlur={() => {
          if (description !== task.description) onSave({ description });
        }}
        className="mt-1 w-full resize-none border-none bg-transparent text-sm leading-relaxed text-text-muted outline-none placeholder:text-text-subtle"
      />
    </div>
  );
}
