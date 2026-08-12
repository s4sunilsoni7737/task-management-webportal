"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Search } from "lucide-react";
import { TasksToolbar } from "@/components/tasks/tasks-toolbar";
import { TaskGroup } from "@/components/tasks/task-group";
import { TasksBoard } from "@/components/tasks/tasks-board";
import { EmptyState } from "@/components/ui/empty-state";
import { QueryErrorCard } from "@/components/ui/query-error-card";
import { Skeleton } from "@/components/ui/skeleton";
import { GlobalLoader } from "@/components/ui/global-loader";
import { AddTaskModal } from "@/components/tasks/add-task-modal";
import { useProject } from "@/hooks/useProjects";
import { useGroupedTasks } from "@/hooks/useTasks";
import { useMembers, useLabels } from "@/hooks/useLookups";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useUiStore } from "@/store/uiStore";
import {
  DEFAULT_TASK_FIELDS,
  type TaskFieldVisibility,
} from "@/components/tasks/task-fields";
import type { TaskFilters } from "@/components/tasks/filter-popover";
import { routes } from "@/lib/routeBuilder";
import { TASK_STATUSES } from "@/lib/types";

const EMPTY_FILTERS: TaskFilters = { memberId: null, labelId: null, priority: null, status: null, dueDate: null, teamId: null, reporterId: null };

/**
 * Project-scoped Tasks view. Reuses the exact Tasks module UI (toolbar,
 * grouping, fields) â€” all search/filter criteria are SERVER-side params via
 * `GET /tasks?projectId=<id>&groupByStatus=true`, per design_break_down.md Â§5.
 */
export default function ProjectTasksPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const view = useUiStore((s) => s.taskView);
  const setView = useUiStore((s) => s.setTaskView);

  const { data: project, isLoading: projectLoading } = useProject(projectId);
  const { data: members = [] } = useMembers();
  const { data: labels = [] } = useLabels();
  const [addModalOpen, setAddModalOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [visibleFields, setVisibleFields] = useState<TaskFieldVisibility>(DEFAULT_TASK_FIELDS);
  const [filters, setFilters] = useState<TaskFilters>(EMPTY_FILTERS);

  const debouncedSearch = useDebouncedValue(search, 350);

  const {
    data: tasksData,
    isLoading: tasksLoading,
    isError,
    error,
    refetch,
  } = useGroupedTasks({
    projectId,
    q: debouncedSearch || undefined,
    memberId: filters.memberId ?? undefined,
    labelId: filters.labelId ?? undefined,
    priority: filters.priority ?? undefined,
  });

  const grouped = tasksData?.grouped ?? {};
  const total = tasksData?.total ?? 0;
  const allTasks = Object.values(grouped).flat();

  function toggleField(key: string) {
    setVisibleFields((prev) => ({
      ...prev,
      [key]: !(prev[key as keyof TaskFieldVisibility] ?? true),
    }));
  }

  if (projectLoading) {
    return (
      <div className="fixed inset-0">
        <GlobalLoader />
      </div>
    );
  }

  if (!project) {
    return <EmptyState title="Project not found" description="It may have been deleted." />;
  }

  return (
    <>
      <div className="mb-5 flex min-h-8 flex-wrap items-center justify-between gap-2">
        <div>
          <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1 text-sm">
            <Link href={routes.projects()} className="truncate text-text-muted hover:text-text">
              Projects
            </Link>
            <ChevronRight className="h-3 w-3 shrink-0 text-text-subtle" />
            <span className="truncate font-medium text-text">{project.name}</span>
          </nav>
          <h1 className="text-xl font-bold text-text">Tasks</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
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
            onAddTask={() => setAddModalOpen(true)}
          />
        </div>
      </div>

      {tasksLoading ? (
          <div>
            <Skeleton className="h-48 rounded-md" />
          </div>
        ) : isError ? (
          <QueryErrorCard error={error} onRetry={() => refetch()} />
        ) : total === 0 ? (
          <EmptyState
            icon={Search}
            title="No tasks yet"
            description="Add the first task for this project."
          />
        ) : view === "board" ? (
          <TasksBoard tasks={allTasks} projectId={projectId} />
        ) : (
          <div className="flex flex-col gap-2">
            {TASK_STATUSES.map((status) => (
              <TaskGroup
                key={status}
                status={status}
                tasks={grouped[status] ?? []}
                visibleFields={visibleFields}
                projectId={projectId}
              />
            ))}
          </div>
        )}

      <AddTaskModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        projectId={projectId}
      />
    </>
  );
}