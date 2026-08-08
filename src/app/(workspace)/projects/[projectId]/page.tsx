"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Search } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { TopBar } from "../../../../components/shell/top-bar";
import { PageHeader } from "../../../../components/shell/page-header";
import { Breadcrumbs } from "../../../../components/shell/breadcrumbs";
import { TasksToolbar } from "../../../../components/tasks/tasks-toolbar";
import { TaskGroup } from "../../../../components/tasks/task-group";
import { TasksBoard } from "../../../../components/tasks/tasks-board";
import { EmptyState } from "../../../../components/ui/empty-state";
import { GlobalLoader } from "../../../../components/ui/global-loader";
import { useProject } from "../../../../hooks/useProjects";
import { useTasks, useCreateTask } from "../../../../hooks/useTasks";
import { useMembers, useLabels } from "../../../../hooks/useLookups";
import { useUiStore } from "../../../../store/uiStore";
import {
  DEFAULT_TASK_FIELDS,
  type TaskFieldVisibility,
} from "../../../../components/tasks/task-fields";
import type { TaskFilters } from "../../../../components/ui/filter-popover";
import { routes } from "../../../../lib/routeBuilder";
import { TASK_STATUSES } from "../../../../lib/types";

const EMPTY_FILTERS: TaskFilters = { memberId: null, labelId: null, priority: null };

/**
 * Project-scoped Tasks view. Reuses the exact Tasks module UI (toolbar,
 * grouping, fields), filtered to this project, per design_break_down.md §5
 * and Scope of Work §3.5 ("Project-scoped task screen reuses the exact
 * Tasks module UI").
 */
export default function ProjectTasksPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const queryClient = useQueryClient();
  const view = useUiStore((s) => s.taskView);
  const setView = useUiStore((s) => s.setTaskView);

  const { data: project, isLoading: projectLoading } = useProject(projectId);
  const { data: tasks = [], isLoading: tasksLoading } = useTasks({ projectId });
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
      { title: "New task", status: "todo", projectId },
      { onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }) },
    );
  }

  if (projectLoading) {
    return (
      <div className="fixed inset-0">
        <GlobalLoader />
      </div>
    );
  }

  if (!project) {
    return (
      <>
        <TopBar />
        <main className="flex-1 p-6">
          <EmptyState title="Project not found" description="It may have been deleted." />
        </main>
      </>
    );
  }

  return (
    <>
      <TopBar left={<Breadcrumbs items={[{ label: "Projects", href: routes.projects() }, { label: project.name }]} />} />
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

        {tasksLoading ? (
          <div className="h-48 animate-pulse rounded-md bg-surface-muted" />
        ) : filteredTasks.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No tasks yet"
            description="Add the first task for this project."
          />
        ) : view === "board" ? (
          <TasksBoard tasks={filteredTasks} projectId={projectId} />
        ) : (
          <div className="flex flex-col gap-5">
            {TASK_STATUSES.map((status) => (
              <TaskGroup
                key={status}
                status={status}
                tasks={filteredTasks.filter((t) => t.status === status)}
                visibleFields={visibleFields}
                projectId={projectId}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
