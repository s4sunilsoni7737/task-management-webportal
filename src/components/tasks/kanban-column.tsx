"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { KanbanCard } from "./kanban-card";
import { InlineAddTaskRow } from "./inline-add-task-row";
import { STATUS_CONFIG } from "../../lib/utils/enum-utils";
import { useCreateTask } from "../../hooks/useTasks";
import { cn } from "../../lib/utils";
import type { Task, TaskStatus } from "../../lib/types";

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  projectId?: string | null;
  draggingTaskId: string | null;
  onDragStart: (taskId: string) => void;
  onDropped: () => void;
}

/** Single Kanban column — header with count + quick-add, card list, drop target. */
export function KanbanColumn({
  status,
  tasks,
  projectId,
  draggingTaskId,
  onDragStart,
  onDropped,
}: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const queryClient = useQueryClient();
  const createTask = useCreateTask();
  const config = STATUS_CONFIG[status];
  const StatusIcon = config.icon;

  function addTask(title: string) {
    createTask.mutate({ title, status, projectId: projectId ?? null });
  }

  async function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    if (!draggingTaskId) return;
    const { tasksService } = await import("../../services/tasks/tasks.service");
    await tasksService.update(draggingTaskId, { status });
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
    onDropped();
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      className={cn(
        "flex w-72 shrink-0 flex-col rounded-md border border-border bg-surface-muted/40 p-2",
        isDragOver && "border-accent bg-accent-soft/40",
      )}
    >
      <div className="mb-2 flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-text">
          <StatusIcon className="h-3.5 w-3.5" style={{ color: `var(${config.colorVar})` }} />
          {config.label}
          <span className="text-xs font-normal text-text-subtle">{tasks.length}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 overflow-y-auto scrollbar-thin">
        {tasks.map((task) => (
          <KanbanCard key={task.id} task={task} onDragStart={onDragStart} />
        ))}
      </div>

      <div className="mt-2">
        <InlineAddTaskRow onAdd={addTask} pending={createTask.isPending} label="Add Task" />
      </div>
    </div>
  );
}
