"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { GripVertical, Plus, MoreHorizontal, CalendarDays, Tag, Loader2 } from "lucide-react";
import { InlineAddTaskRow } from "@/components/tasks/inline-add-task-row";
import { Avatar } from "@/components/ui/avatar";
import { STATUS_CONFIG } from "@/lib/utils/enum-utils";
import { formatDateShort } from "@/lib/utils/formatters";
import { useCreateTask } from "@/hooks/useTasks";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/routeBuilder";
import type { Task, TaskStatus } from "@/lib/types";

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  projectId?: string | null;
  draggingTaskId: string | null;
  onDragStart: (taskId: string) => void;
  onDropped: () => void;
  draggingColumn?: TaskStatus | null;
  onDragStartColumn?: (status: TaskStatus | null) => void;
  onDragEnterColumn?: (status: TaskStatus) => void;
}

/** Single Kanban column — header with count + quick-add, card list, drop target. */
export function KanbanColumn({
  status,
  tasks,
  projectId,
  draggingTaskId,
  onDragStart,
  onDropped,
  draggingColumn,
  onDragStartColumn,
  onDragEnterColumn,
}: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();
  const createTask = useCreateTask();
  const config = STATUS_CONFIG[status];

  function addTask(title: string) {
    return createTask.mutateAsync({ title, status, projectId: projectId ?? null });
  }

  async function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    if (!draggingTaskId) return;
    
    setIsUpdating(true);
    try {
      const { tasksService } = await import("@/services/tasks/tasks.service");
      await tasksService.update(draggingTaskId, { status });
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
    } finally {
      setIsUpdating(false);
      onDropped();
    }
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
        if (draggingColumn && draggingColumn !== status) {
          onDragEnterColumn?.(status);
        }
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        if (draggingColumn) {
          e.stopPropagation();
          setIsDragOver(false);
        } else {
          handleDrop(e);
        }
      }}
      className={cn(
        "flex w-[340px] shrink-0 flex-col gap-3 rounded-xl border border-border bg-surface-muted/30 p-3 pt-4 transition-colors",
        isDragOver && !draggingColumn && "border-accent bg-accent-soft/40",
        draggingColumn === status && "opacity-50"
      )}
    >
      <div className="flex items-center justify-between px-1 pb-1">
        <div className="flex items-center gap-[8px] font-semibold text-text">
          <div
            draggable
            onDragStart={(e) => {
              e.dataTransfer.effectAllowed = "move";
              onDragStartColumn?.(status);
            }}
            onDragEnd={() => {
              onDragStartColumn?.(null);
            }}
            className="cursor-grab active:cursor-grabbing flex items-center justify-center shrink-0"
            style={{ width: "14px", height: "14px", opacity: 1 }}
          >
            <GripVertical className="h-full w-full text-text-subtle" />
          </div>
          <span
            style={{ width: "56px", height: "14px", opacity: 1 }}
            className="text-sm flex items-center"
          >
            {config.label}
          </span>
          {isUpdating && <Loader2 className="h-3.5 w-3.5 animate-spin text-text-subtle ml-2" />}
        </div>
        <div className="flex items-center gap-1 text-text-subtle">
          <button className="rounded hover:bg-surface-muted p-1 hover:text-text">
            <Plus className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <button className="rounded hover:bg-surface-muted p-1 hover:text-text">
            <MoreHorizontal className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto scrollbar-thin">
        {tasks.map((task) => (
          <KanbanCard key={task.id} task={task} onDragStart={onDragStart} />
        ))}
        <InlineAddTaskRow onAdd={addTask} pending={createTask.isPending} label="Add Task" />
      </div>
    </div>
  );
}

interface KanbanCardProps {
  task: Task;
  onDragStart: (taskId: string) => void;
}

/** Draggable task card shown in each Board column. */
function KanbanCard({ task, onDragStart }: KanbanCardProps) {
  const router = useRouter();

  const assigneeName = task.members.length > 0 ? task.members[0].name : "Admin";
  const assigneeAvatar = task.members.length > 0 ? task.members[0].avatarUrl : undefined;

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        onDragStart(task.id);
      }}
      onClick={() => router.push(routes.taskDetail(task.id))}
      className="flex cursor-grab flex-col gap-4 rounded-xl border border-border bg-surface p-4 shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-base font-medium text-text">{task.title}</p>
        <button className="text-text-subtle hover:text-text shrink-0" onClick={(e) => e.stopPropagation()}>
          <MoreHorizontal className="h-5 w-5" strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar name={assigneeName} src={assigneeAvatar} size="sm" />
          <span className="text-sm font-medium text-text">{assigneeName}</span>
        </div>
        
        <div className="flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600">
           <CalendarDays className="h-3.5 w-3.5" />
           {task.dueDate ? formatDateShort(task.dueDate) : "29 Jul"}
        </div>
      </div>

      {task.labels.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {task.labels.slice(0, 3).map((label) => (
             <div key={label.id} className="flex items-center gap-1.5 rounded-full bg-surface-muted px-3 py-1 text-xs font-medium text-text">
               <Tag className="h-3.5 w-3.5" />
               {label.name}
             </div>
          ))}
        </div>
      )}
    </div>
  );
}

