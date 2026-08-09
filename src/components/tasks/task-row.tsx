"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { DateChip } from "../ui/date-chip";
import { OverflowMenu } from "../ui/overflow-menu";
import { TaskMembersCell } from "./task-members-cell";
import { TaskPriorityCell } from "./task-priority-cell";
import { useUpdateTask, useDeleteTask } from "../../hooks/useTasks";
import { routes } from "../../lib/routeBuilder";
import type { Task } from "../../lib/types";
import type { TaskFieldVisibility } from "./task-fields";

interface TaskRowProps {
  task: Task;
  visibleFields: TaskFieldVisibility;
}

/** A single row in the Tasks table — reused by List groups, project-scoped tasks, and Subtasks. */
export function TaskRow({ task, visibleFields }: TaskRowProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const updateTask = useUpdateTask(task.id);
  const deleteTask = useDeleteTask();

  function patch(input: Parameters<typeof updateTask.mutate>[0]) {
    updateTask.mutate(input, {
      onSuccess: (updated) => {
        queryClient.setQueryData(["tasks", task.id], updated);
      },
    });
  }

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
          <TaskPriorityCell value={task.priority} onChange={(priority) => patch({ priority })} />
        </td>
      )}
      {visibleFields.members && (
        <td className="px-3 py-2">
          <TaskMembersCell members={task.members} onChange={(memberIds) => patch({ memberIds })} />
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
