"use client";

import { useRouter } from "next/navigation";
import { DateChip } from "../ui/date-chip";
import { PriorityBadge } from "../ui/priority-badge";
import { AvatarStack } from "../ui/avatar-stack";
import { LabelChip } from "../ui/label-chip";
import { routes } from "../../lib/routeBuilder";
import type { Task } from "../../lib/types";

interface KanbanCardProps {
  task: Task;
  onDragStart: (taskId: string) => void;
}

/** Draggable task card shown in each Board column, per design_break_down.md §5. */
export function KanbanCard({ task, onDragStart }: KanbanCardProps) {
  const router = useRouter();

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        onDragStart(task.id);
      }}
      onClick={() => router.push(routes.taskDetail(task.id))}
      className="cursor-grab space-y-2 rounded-md border border-border bg-surface p-2.5 text-sm shadow-card transition-shadow hover:shadow-popover active:cursor-grabbing"
    >
      <p className="line-clamp-2 font-medium text-text">{task.title}</p>

      {task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {task.labels.slice(0, 3).map((label) => (
            <LabelChip key={label.id} label={label} />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between gap-2">
        <PriorityBadge priority={task.priority} showLabel={false} />
        <DateChip date={task.endDate} short />
      </div>

      <div onClick={(e) => e.stopPropagation()}>
        <AvatarStack members={task.members} size="xs" />
      </div>
    </div>
  );
}
