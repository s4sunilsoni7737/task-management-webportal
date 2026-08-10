"use client";

import { useState } from "react";
import { KanbanColumn } from "@/components/tasks/kanban-column";
import { TASK_STATUSES, type Task } from "@/lib/types";

interface TasksBoardProps {
  tasks: Task[];
  projectId?: string | null;
}

/** Board (Kanban) view — one column per Status, extends horizontally with scroll. */
export function TasksBoard({ tasks, projectId }: TasksBoardProps) {
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);

  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-thin pb-2">
      {TASK_STATUSES.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          tasks={tasks.filter((t) => t.status === status)}
          projectId={projectId}
          draggingTaskId={draggingTaskId}
          onDragStart={setDraggingTaskId}
          onDropped={() => setDraggingTaskId(null)}
        />
      ))}
    </div>
  );
}
