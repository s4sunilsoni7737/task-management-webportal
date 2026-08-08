import { TaskRow } from "./task-row";
import type { Task } from "../../lib/types";
import type { TaskFieldVisibility } from "./task-fields";

interface TaskTableProps {
  tasks: Task[];
  visibleFields: TaskFieldVisibility;
}

/** Bordered table shared by Task List groups, project-scoped tasks, and the Subtasks section. */
export function TaskTable({ tasks, visibleFields }: TaskTableProps) {
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
            <TaskRow key={task.id} task={task} visibleFields={visibleFields} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
