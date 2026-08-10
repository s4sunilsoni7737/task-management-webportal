"use client";

import { useRef, useState } from "react";
import { Plus } from "lucide-react";
import { LabelChip } from "../../../../components/ui/label-chip";
import { LabelPicker } from "./label-picker";
import { useLabels } from "../../../../hooks/useLookups";
import type { Task } from "../../../../lib/types";

interface LabelsRowProps {
  task: Task;
  onChange: (labelIds: string[]) => void;
}

/** "Labels" row â€” pill-style labels with an add/remove picker, per design_break_down.md Â§6. */
export function LabelsRow({ task, onChange }: LabelsRowProps) {
  const { data: allLabels = [] } = useLabels();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null!);

  function toggle(labelId: string) {
    const ids = task.labels.map((l) => l.id);
    onChange(ids.includes(labelId) ? ids.filter((id) => id !== labelId) : [...ids, labelId]);
  }

  return (
    <div className="mb-4">
      <p className="mb-1.5 text-xs font-medium text-text-subtle">Labels</p>
      <div className="flex flex-wrap items-center gap-1.5">
        {task.labels.map((label) => (
          <LabelChip key={label.id} label={label} onRemove={() => toggle(label.id)} />
        ))}
        <button
          ref={anchorRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Add label"
          className="flex h-[22px] w-[22px] items-center justify-center rounded-full border border-dashed border-border-strong text-text-subtle transition-colors hover:border-accent hover:text-accent"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>
      <LabelPicker
        open={open}
        onClose={() => setOpen(false)}
        anchorRef={anchorRef}
        labels={allLabels}
        selectedIds={task.labels.map((l) => l.id)}
        onToggle={toggle}
      />
    </div>
  );
}
