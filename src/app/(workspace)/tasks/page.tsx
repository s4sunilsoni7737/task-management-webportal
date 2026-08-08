"use client";

import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { TopBar } from "../../../components/shell/top-bar";
import { PageHeader } from "../../../components/shell/page-header";
import { TasksToolbar } from "../../../components/tasks/tasks-toolbar";
import { TaskGroup } from "../../../components/tasks/task-group";
import { TasksBoard } from "../../../components/tasks/tasks-board";
import { EmptyState } from "../../../components/ui/empty-state";
import { useTasks, useCreateTask } from "../../../hooks/useTasks";
import { useMembers, useLabels } from "../../../hooks/useLookups";
import { useUiStore } from "../../../store/uiStore";
import { DEFAULT_TASK_FIELDS, type TaskFieldVisibility } from "../../../components/tasks/task-fields";
import type { TaskFilters } from "../../../components/ui/filter-popover";
import { TASK_STATUSES } from "../../../lib/types";
import { Search } from "lucide-react";

const EMPTY_FILTERS: TaskFilters = { memberId: null, labelId: null, priority: null };

export default function TasksPage() {
  const queryClient = useQueryClient();
  const view = useUiStore((s) => s.taskView);
  const setView = useUiStore((s) => s.setTaskView);

  const { data: tasks = [], isLoading } = useTasks();
  const { data: members = [] } = useMembers();
  const { data: labels = [] } = useLabels();
  const createTask = useCreateTask();

  const [search, setSearch] = useState("");
  const [visibleFields, setVisibleFields] = useState<TaskFieldVisibility>(DEFAULT_TASK_FIELDS);
  const [filters, setFilters] = useState<TaskFilters>(EMPTY_FILTERS);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (search && !task.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (filters.memberId && !task.members.some((m) => m.id === filters.memberId)) return false;
      if (filters.labelId && !task.labels.some((l) => l.id === filters.labelId)) return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      return true;
    });
  }, [tasks, search, filters]);

  function toggleField(key: string) {
    setVisibleFields((prev) => ({
      ...prev,
      [key]: !(prev[key as keyof TaskFieldVisibility] ?? true),
    }));
  }

  function handleAddTask() {
    createTask.mutate(
      { title: "New task", status: "todo" },
      { onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }) },
    );
  }

  return (
    <>
      <TopBar />
      <main className="flex-1 overflow-y-auto scrollbar-thin p-4 sm:p-6">
        <PageHeader
          title="Tasks"
          toolbar={
            <TasksToolbar
              search={search}
              onSearchChange={setSearch}
              visibleFields={visibleFields}
              onToggleField={toggleField}
              filters={filters}
              onFiltersChange={setFilters}
              members={members}
              labels={labels}
              view={view}
              onViewChange={setView}
              onAddTask={handleAddTask}
            />
          }
        />

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-md bg-surface-muted" />
            ))}
          </div>
        ) : filteredTasks.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No tasks found"
            description="Try adjusting your search or filters."
          />
        ) : view === "board" ? (
          <TasksBoard tasks={filteredTasks} />
        ) : (
          <div className="flex flex-col gap-5">
            {TASK_STATUSES.map((status) => (
              <TaskGroup
                key={status}
                status={status}
                tasks={filteredTasks.filter((t) => t.status === status)}
                visibleFields={visibleFields}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
