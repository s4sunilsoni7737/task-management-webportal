"use client";

import { useQueryClient } from "@tanstack/react-query";
import { CollapsiblePanel } from "../ui/collapsible-panel";
import { EmptyState } from "../ui/empty-state";
import { TaskTable } from "./task-table";
import { InlineAddTaskRow } from "./inline-add-task-row";
import { useCreateTask } from "../../hooks/useTasks";
import { STATUS_CONFIG } from "../../lib/utils/enum-utils";
import type { Task, TaskStatus } from "../../lib/types";
import type { TaskFieldVisibility } from "./task-fields";

interface TaskGroupProps {
  status: TaskStatus;
  tasks: Task[];
  visibleFields: TaskFieldVisibility;
  projectId?: string | null;
}

/** Collapsible "To Do / Doing / Completed / On Hold" group, per design_break_down.md §5. */
export function TaskGroup({ status, tasks, visibleFields, projectId }: TaskGroupProps) {
  const queryClient = useQueryClient();
  const createTask = useCreateTask();
  const config = STATUS_CONFIG[status];

  function addTask(title: string) {
    createTask.mutate(
      { title, status, projectId: projectId ?? null },
      { onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }) },
    );
  }

  return (
    <CollapsiblePanel title={config.label} count={tasks.length} defaultOpen>
      {tasks.length === 0 ? (
        <div className="rounded-md border border-dashed border-border">
          <EmptyState title={`No tasks in ${config.label}`} />
          <div className="border-t border-border px-1 py-1">
            <InlineAddTaskRow onAdd={addTask} pending={createTask.isPending} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          <TaskTable tasks={tasks} visibleFields={visibleFields} />
          <InlineAddTaskRow onAdd={addTask} pending={createTask.isPending} />
        </div>
      )}
    </CollapsiblePanel>
  );
}
