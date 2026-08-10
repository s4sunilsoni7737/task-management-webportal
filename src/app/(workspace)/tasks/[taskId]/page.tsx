"use client";

import { useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { TopBar } from "../../../../components/shell/top-bar";
import { Breadcrumbs } from "../../../../components/shell/breadcrumbs";
import { GlobalLoader } from "../../../../components/ui/global-loader";
import { QueryErrorCard } from "../../../../components/ui/query-error-card";
import { EmptyState } from "../../../../components/ui/empty-state";
import { TaskHeader } from "./task-header";
import { PropertiesRow } from "./properties-row";
import { LabelsRow } from "./labels-row";
import { ResourcesRow } from "./resources-row";
import { SubtasksSection } from "./subtasks-section";
import { CommentsSection } from "./comments-section";
import { DetailsCard } from "./details-card";
import { UpdatesCard } from "./updates-card";
import { TaskDetailActions } from "./task-detail-actions";
import { DatePickerPopover } from "./date-picker-popover";
import { useTask, useUpdateTask, useDeleteTask } from "../../../../hooks/useTasks";
import { routes } from "../../../../lib/routeBuilder";
import type { UpdateTaskInput } from "../../../../lib/types";

export default function TaskDetailPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: task, isLoading, isError, error, refetch } = useTask(taskId);
  const updateTask = useUpdateTask(taskId);
  const deleteTask = useDeleteTask();

  const [panelOpen, setPanelOpen] = useState(true);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const dateAnchorRef = useRef<HTMLDivElement>(null!);

  function save(input: UpdateTaskInput) {
    updateTask.mutate(input, {
      onSuccess: (updated) => queryClient.setQueryData(["tasks", taskId], updated),
    });
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0">
        <GlobalLoader />
      </div>
    );
  }

  if (isError) {
    return (
      <>
        <TopBar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <QueryErrorCard error={error} onRetry={() => refetch()} />
        </main>
      </>
    );
  }

  if (!task) {
    return (
      <>
        <TopBar />
        <main className="flex-1 p-6">
          <EmptyState title="Task not found" description="It may have been deleted or moved." />
        </main>
      </>
    );
  }

  const breadcrumbItems = task.projectId
    ? [
        { label: "Projects", href: routes.projects() },
        { label: "Tasks", href: routes.projectDetail(task.projectId) },
        { label: task.title },
      ]
    : [{ label: "Tasks", href: routes.tasks() }, { label: task.title }];

  return (
    <>
      <TopBar
        left={<Breadcrumbs items={breadcrumbItems} />}
        right={
          <TaskDetailActions
            task={task}
            onToggleLock={() => save({ isLocked: !task.isLocked })}
            onDelete={() => {
              deleteTask.mutate(task.id, {
                onSuccess: () => router.push(task.projectId ? routes.projectDetail(task.projectId) : routes.tasks()),
              });
            }}
            panelOpen={panelOpen}
            onTogglePanel={() => setPanelOpen((v) => !v)}
          />
        }
      />
      <main className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="flex flex-col gap-6 p-4 sm:p-6 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1 lg:max-w-[560px]">
            <TaskHeader task={task} onSave={save} />
            <PropertiesRow
              task={task}
              dateAnchorRef={dateAnchorRef}
              onOpenDatePicker={() => setDatePickerOpen((v) => !v)}
            />
            <DatePickerPopover
              open={datePickerOpen}
              onClose={() => setDatePickerOpen(false)}
              anchorRef={dateAnchorRef}
              startDate={task.startDate}
              endDate={task.dueDate}
              onChange={(range) => save(range)}
            />
            <LabelsRow task={task} onChange={(labelIds) => save({ labelIds })} />
            <ResourcesRow taskId={task.id} />
            <SubtasksSection taskId={task.id} />
            <CommentsSection taskId={task.id} />
          </div>

          {panelOpen && (
            <aside className="flex w-full shrink-0 flex-col gap-4 lg:w-[280px]">
              <DetailsCard task={task} onSave={save} />
              <UpdatesCard taskId={task.id} />
            </aside>
          )}
        </div>
      </main>
    </>
  );
}
