"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { TopBar } from "../../../components/shell/top-bar";
import { PageHeader } from "../../../components/shell/page-header";
import { TasksToolbar } from "../../../components/tasks/tasks-toolbar";
import { TaskGroup } from "../../../components/tasks/task-group";
import { TasksBoard } from "../../../components/tasks/tasks-board";
import { EmptyState } from "../../../components/ui/empty-state";
import { QueryErrorCard } from "../../../components/ui/query-error-card";
import { Skeleton } from "../../../components/ui/skeleton";
import { AddTaskModal } from "../../../components/tasks/add-task-modal";
import { useGroupedTasks } from "../../../hooks/useTasks";
import { useMembers, useLabels } from "../../../hooks/useLookups";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import { useUiStore } from "../../../store/uiStore";
import { DEFAULT_TASK_FIELDS, type TaskFieldVisibility } from "../../../components/tasks/task-fields";
import type { TaskFilters } from "../../../components/ui/filter-popover";
import { TASK_STATUSES } from "../../../lib/types";

const EMPTY_FILTERS: TaskFilters = { memberId: null, labelId: null, priority: null };

/**
 * Tasks home page. All search/filter criteria are SERVER-side query params
 * (`q`, `memberId`, `labelId`, `priority`) consumed by `GET /tasks?groupByStatus=true`,
 * which returns tasks pre-grouped into status buckets — powering the List
 * view's collapsible sections and the Board's Kanban columns. No client-side
 * filtering happens here (the old `limit:1000` + `.filter()` bug is gone).
 */
export default function TasksPage() {
  const view = useUiStore((s) => s.taskView);
  const setView = useUiStore((s) => s.setTaskView);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [visibleFields, setVisibleFields] = useState<TaskFieldVisibility>(DEFAULT_TASK_FIELDS);
  const [filters, setFilters] = useState<TaskFilters>(EMPTY_FILTERS);

  const debouncedSearch = useDebouncedValue(search, 350);
  const { data: members = [] } = useMembers();
  const { data: labels = [] } = useLabels();

  const { data, isLoading, isError, error, refetch } = useGroupedTasks({
    q: debouncedSearch || undefined,
    memberId: filters.memberId ?? undefined,
    labelId: filters.labelId ?? undefined,
    priority: filters.priority ?? undefined,
  });

  const grouped = data?.grouped ?? {};
  const total = data?.total ?? 0;
  const allTasks = Object.values(grouped).flat();

  function toggleField(key: string) {
    setVisibleFields((prev) => ({
      ...prev,
      [key]: !(prev[key as keyof TaskFieldVisibility] ?? true),
    }));
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
              onAddTask={() => setAddModalOpen(true)}
            />
          }
        />

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 rounded-md" />
            ))}
          </div>
        ) : isError ? (
          <QueryErrorCard error={error} onRetry={() => refetch()} />
        ) : total === 0 ? (
          <EmptyState
            icon={Search}
            title="No tasks found"
            description="Try adjusting your search or filters."
          />
        ) : view === "board" ? (
          <TasksBoard tasks={allTasks} />
        ) : (
          <div className="flex flex-col gap-5">
            {TASK_STATUSES.map((status) => (
              <TaskGroup
                key={status}
                status={status}
                tasks={grouped[status] ?? []}
                visibleFields={visibleFields}
              />
            ))}
          </div>
        )}
      </main>

      <AddTaskModal open={addModalOpen} onClose={() => setAddModalOpen(false)} />
    </>
  );
}
