"use client";

import { useRouter } from "next/navigation";
import { DateChip } from "../ui/date-chip";
import { OverflowMenu } from "../ui/overflow-menu";
import { useMediaQuery, BREAKPOINTS } from "../../hooks/useMediaQuery";
import { routes } from "../../lib/routeBuilder";
import { TaskPriorityCell } from "./task-priority-cell";
import { TaskMembersCell } from "./task-members-cell";
import { useDeleteTask, useUpdateTask } from "../../hooks/useTasks";
import type { Task } from "../../lib/types";
import type { TaskFieldVisibility } from "./task-fields";

interface TaskTableProps {
  tasks: Task[];
  visibleFields: TaskFieldVisibility;
}

/**
 * Bordered table shared by Task List groups, project-scoped tasks, and the
 * Subtasks section. On screens ≥ 700px renders the classic dense table; below
 * that it switches to stacked row cards (design_break_down.md §14) so names
 * stay readable without horizontal scrolling.
 */
export function TaskTable({ tasks, visibleFields }: TaskTableProps) {
  const isMobile = useMediaQuery(BREAKPOINTS.mobile);

  if (isMobile) {
    return (
      <div className="flex flex-col gap-1.5">
        {tasks.map((task) => (
          <TaskMobileCard key={task.id} task={task} visibleFields={visibleFields} />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="w-full min-w-[560px] border-collapse">
        <thead>
          <tr className="border-b border-border bg-surface-muted text-left text-xs font-medium text-text-muted">
            <th className="px-3 py-2 font-medium">Task</th>
            {visibleFields.priority && <th className="px-3 py-2 font-medium">Priority</th>}
            {visibleFields.members && <th className="px-3 py-2 font-medium">Members</th>}
            {visibleFields.dueDate && <th className="px-3 py-2 font-medium">Due Date</th>}
            <th className="w-10 px-2 py-2" />
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <TaskDesktopRow key={task.id} task={task} visibleFields={visibleFields} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TaskDesktopRow({
  task,
  visibleFields,
}: {
  task: Task;
  visibleFields: TaskFieldVisibility;
}) {
  const router = useRouter();
  const updateTask = useUpdateTask(task.id);
  const deleteTask = useDeleteTask();

  return (
    <tr
      onClick={() => router.push(routes.taskDetail(task.id))}
      className="cursor-pointer border-b border-border text-sm last:border-b-0 hover:bg-surface-muted"
    >
      <td className="px-3 py-2 text-text">
        <span className="line-clamp-1">{task.title}</span>
      </td>
      {visibleFields.priority && (
        <td className="px-3 py-2">
          <TaskPriorityCell value={task.priority} onChange={(priority) => updateTask.mutate({ priority })} />
        </td>
      )}
      {visibleFields.members && (
        <td className="px-3 py-2">
          <TaskMembersCell members={task.members} onChange={(memberIds) => updateTask.mutate({ memberIds })} />
        </td>
      )}
      {visibleFields.dueDate && (
        <td className="px-3 py-2">
          <DateChip date={task.dueDate} short />
        </td>
      )}
      <td className="w-10 px-2 py-2 text-right" onClick={(e) => e.stopPropagation()}>
        <OverflowMenu
          label={`Actions for ${task.title}`}
          onEdit={() => router.push(routes.taskDetail(task.id))}
          onDelete={() => deleteTask.mutate(task.id)}
        />
      </td>
    </tr>
  );
}

/** Mobile-optimized row card — name first, then a compact detail grid. */
function TaskMobileCard({ task, visibleFields }: { task: Task; visibleFields: TaskFieldVisibility }) {
  const router = useRouter();
  const deleteTask = useDeleteTask();

  return (
    <div
      onClick={() => router.push(routes.taskDetail(task.id))}
      className="cursor-pointer rounded-md border border-border bg-surface px-3 py-2.5"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="line-clamp-2 text-sm font-medium text-text">{task.title}</span>
        <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
          <OverflowMenu
            label={`Actions for ${task.title}`}
            onEdit={() => router.push(routes.taskDetail(task.id))}
            onDelete={() => deleteTask.mutate(task.id)}
          />
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-text-muted">
        {visibleFields.priority && <TaskPriorityCell value={task.priority} />}
        {visibleFields.dueDate && <DateChip date={task.dueDate} short />}
        {visibleFields.members && <TaskMembersCell members={task.members} size="xs" />}
      </div>
    </div>
  );
}
