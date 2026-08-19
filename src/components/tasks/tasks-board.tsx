"use client";

import { useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { KanbanColumn } from "@/components/tasks/kanban-column";
import { TASK_STATUSES, type Task, type TaskStatus } from "@/lib/types";

interface TasksBoardProps {
  tasks: Task[];
  projectId?: string | null;
  statusFilter?: TaskStatus | null;
}

/** Board (Kanban) view — one column per Status, extends horizontally with scroll. */
export function TasksBoard({ tasks, projectId, statusFilter }: TasksBoardProps) {
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [columns, setColumns] = useState<TaskStatus[]>([...TASK_STATUSES]);
  const [draggingColumn, setDraggingColumn] = useState<TaskStatus | null>(null);
  
  const [parent] = useAutoAnimate<HTMLDivElement>();

  function handleDragEnterColumn(targetColumn: TaskStatus) {
    if (!draggingColumn || draggingColumn === targetColumn) return;
    setColumns((prev) => {
      const newCols = [...prev];
      const fromIdx = newCols.indexOf(draggingColumn);
      const toIdx = newCols.indexOf(targetColumn);
      if (fromIdx === -1 || toIdx === -1) return prev;
      newCols.splice(fromIdx, 1);
      newCols.splice(toIdx, 0, draggingColumn);
      return newCols;
    });
  }

  const displayColumns = statusFilter ? columns.filter((c) => c === statusFilter) : columns;

  return (
    <div ref={parent} className="flex flex-col sm:flex-row gap-4 sm:gap-2 sm:overflow-x-auto scrollbar-thin pb-2">
      {displayColumns.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          tasks={tasks.filter((t) => t.status === status)}
          projectId={projectId}
          draggingTaskId={draggingTaskId}
          onDragStart={setDraggingTaskId}
          onDropped={() => setDraggingTaskId(null)}
          draggingColumn={draggingColumn}
          onDragStartColumn={setDraggingColumn}
          onDragEnterColumn={handleDragEnterColumn}
        />
      ))}
    </div>
  );
}
