"use client";

import { useQueryClient } from "@tanstack/react-query";
import { CollapsiblePanel } from "@/components/ui/collapsible-panel";
import { EmptyState } from "@/components/ui/empty-state";
import { TaskTable } from "@/components/tasks/task-table";
import { InlineAddTaskRow } from "@/components/tasks/inline-add-task-row";
import { useCreateTask } from "@/hooks/useTasks";
import { STATUS_CONFIG } from "@/lib/utils/enum-utils";
import type { Task, TaskStatus } from "@/lib/types";
import type { TaskFieldVisibility } from "@/components/tasks/task-fields";

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
    return createTask.mutateAsync(
      { title, status, projectId: projectId ?? null },
      { onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }) },
    );
  }

  return (
    <CollapsiblePanel title={config.label} defaultOpen>
      {tasks.length === 0 ? (
        <div className="rounded-md border border-dashed border-border">
          <EmptyState title={`No tasks in ${config.label}`} />
          <div className="border-t border-border px-1 py-1">
            <InlineAddTaskRow onAdd={addTask} pending={createTask.isPending} />
          </div>
        </div>
      ) : (
        <TaskTable tasks={tasks} visibleFields={visibleFields} onAddTask={addTask} isAddingTask={createTask.isPending} />
      )}
    </CollapsiblePanel>
  );
}
