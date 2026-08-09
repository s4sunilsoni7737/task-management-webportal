"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Search } from "lucide-react";
import { TopBar } from "../../../../components/shell/top-bar";
import { PageHeader } from "../../../../components/shell/page-header";
import { Breadcrumbs } from "../../../../components/shell/breadcrumbs";
import { TasksToolbar } from "../../../../components/tasks/tasks-toolbar";
import { TaskGroup } from "../../../../components/tasks/task-group";
import { TasksBoard } from "../../../../components/tasks/tasks-board";
import { EmptyState } from "../../../../components/ui/empty-state";
import { QueryErrorCard } from "../../../../components/ui/query-error-card";
import { Skeleton } from "../../../../components/ui/skeleton";
import { GlobalLoader } from "../../../../components/ui/global-loader";
import { AddTaskModal } from "../../../../components/tasks/add-task-modal";
import { useProject } from "../../../../hooks/useProjects";
import { useGroupedTasks } from "../../../../hooks/useTasks";
import { useMembers, useLabels } from "../../../../hooks/useLookups";
import { useDebouncedValue } from "../../../../hooks/useDebouncedValue";
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
 * grouping, fields) — all search/filter criteria are SERVER-side params via
 * `GET /tasks?projectId=<id>&groupByStatus=true`, per design_break_down.md §5.
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
              onAddTask={() => setAddModalOpen(true)}
            />
          }
        />

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
          <div className="flex flex-col gap-5">
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
      </main>

      <AddTaskModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        projectId={projectId}
      />
    </>
  );
}