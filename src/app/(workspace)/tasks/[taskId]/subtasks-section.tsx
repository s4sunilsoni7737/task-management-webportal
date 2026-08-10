"use client";

import { CollapsiblePanel } from "../../../../components/ui/collapsible-panel";
import { TaskTable } from "../../../../components/tasks/task-table";
import { InlineAddTaskRow } from "../../../../components/tasks/inline-add-task-row";
import { EmptyState } from "../../../../components/ui/empty-state";
import { useSubtasks } from "../../../../hooks/useTasks";
import { useAddSubtask } from "../../../../hooks/useTaskDetail";
import { DEFAULT_TASK_FIELDS } from "../../../../components/tasks/task-fields";

/** "Subtasks" table â€” Task/Priority/Members/Due Date/Actions, per design_break_down.md Â§6. */
export function SubtasksSection({ taskId }: { taskId: string }) {
  const { data: subtasks = [], isLoading } = useSubtasks(taskId);
  const addSubtask = useAddSubtask(taskId);

  return (
    <CollapsiblePanel title="Subtasks" count={subtasks.length} defaultOpen className="mb-5">
      {isLoading ? (
        <div className="h-20 animate-pulse rounded-md bg-surface-muted" />
      ) : subtasks.length === 0 ? (
        <div className="rounded-md border border-dashed border-border">
          <EmptyState title="No subtasks yet" />
          <div className="border-t border-border px-1 py-1">
            <InlineAddTaskRow
              label="Add Subtasks"
              pending={addSubtask.isPending}
              onAdd={(title) => addSubtask.mutate(title)}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          <TaskTable tasks={subtasks} visibleFields={DEFAULT_TASK_FIELDS} />
          <InlineAddTaskRow
            label="Add Subtasks"
            pending={addSubtask.isPending}
            onAdd={(title) => addSubtask.mutate(title)}
          />
        </div>
      )}
    </CollapsiblePanel>
  );
}
