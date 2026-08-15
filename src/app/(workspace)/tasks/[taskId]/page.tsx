"use client";

import { useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronRight, Lock, LockOpen, MoreHorizontal, PanelRight, Share2, Trash2, Eye } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { GlobalLoader } from "@/components/ui/global-loader";
import { IconButton } from "@/components/ui/icon-button";
import { MenuItem } from "@/components/ui/menu";
import { Popover } from "@/components/ui/popover";
import { QueryErrorCard } from "@/components/ui/query-error-card";
import { toast } from "@/store/toastStore";
import { useDeleteTask, useTask, useUpdateTask } from "@/hooks/useTasks";
import { tasksService } from "@/services/tasks/tasks.service";
import { routes } from "@/lib/routeBuilder";
import { cn } from "@/lib/utils";
import type { Task, UpdateTaskInput } from "@/lib/types";

import { DatePickerPopover, DetailsCard, UpdatesCard } from "@/components/tasks/task-details-sidebar";
import { CommentsSection } from "@/components/tasks/task-comments";
import { LabelsRow, PropertiesRow, ResourcesRow, SubtasksSection, TaskHeader } from "@/components/tasks/task-main-fields";

interface TaskDetailActionsProps {
  task: Task;
  onToggleLock: () => void;
  onDelete: () => void;
  panelOpen: boolean;
  onTogglePanel: () => void;
}

function TaskDetailActions({
  task,
  onToggleLock,
  onDelete,
  panelOpen,
  onTogglePanel,
}: TaskDetailActionsProps) {
  const [overflowOpen, setOverflowOpen] = useState(false);
  const [watching, setWatching] = useState(false);
  const overflowRef = useRef<HTMLButtonElement>(null!);

  function toggleWatch() {
    setWatching(true);
    const action = task.watcherCount > 0 ? tasksService.unwatch(task.id) : tasksService.watch(task.id);
    action
      .then(() => {
        toast.success(task.watcherCount > 0 ? "Stopped watching task" : "Now watching task");
      })
      .catch(() => toast.error("Couldn't update watch status"))
      .finally(() => setWatching(false));
  }

  return (
    <>
      <IconButton aria-label={task.isLocked ? "Unlock task" : "Lock task"} onClick={onToggleLock}>
        {task.isLocked ? <Lock className="h-4 w-4" /> : <LockOpen className="h-4 w-4" />}
      </IconButton>

      <button
        type="button"
        onClick={toggleWatch}
        disabled={watching}
        aria-label={task.watcherCount > 0 ? "Stop watching task" : "Watch task"}
        className="flex h-8 items-center gap-1 rounded-sm px-2 text-text-muted transition-colors hover:bg-surface-muted hover:text-text disabled:opacity-50"
      >
        <Eye className="h-4 w-4" />
        <span className="text-xs">{task.watcherCount}</span>
      </button>

      <IconButton
        aria-label="Share task"
        onClick={() => {
          navigator.clipboard?.writeText(window.location.href).catch(() => {});
          toast.success("Link copied to clipboard");
        }}
      >
        <Share2 className="h-4 w-4" />
      </IconButton>

      <IconButton
        ref={overflowRef}
        aria-label="More actions"
        active={overflowOpen}
        onClick={() => setOverflowOpen((v) => !v)}
      >
        <MoreHorizontal className="h-4 w-4" />
      </IconButton>
      <Popover
        open={overflowOpen}
        onClose={() => setOverflowOpen(false)}
        anchorRef={overflowRef}
        align="end"
        className="w-[150px] p-1"
      >
        <MenuItem
          icon={Trash2}
          label="Delete task"
          destructive
          onClick={() => {
            onDelete();
            setOverflowOpen(false);
          }}
        />
      </Popover>

      <IconButton aria-label="Toggle details panel" active={panelOpen} onClick={onTogglePanel}>
        <PanelRight className="h-4 w-4" />
      </IconButton>
    </>
  );
}

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
    return <QueryErrorCard error={error} onRetry={() => refetch()} />;
  }

  if (!task) {
    return <EmptyState title="Task not found" description="It may have been deleted or moved." />;
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
      <div className="mb-5 flex min-h-8 flex-wrap items-center justify-between gap-2">
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1 text-sm">
          {breadcrumbItems.map((item, index) => (
            <span key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-1">
              {index > 0 && <ChevronRight className="h-3 w-3 shrink-0 text-text-subtle" />}
              {item.href && index < breadcrumbItems.length - 1 ? (
                <Link href={item.href} className="truncate text-text-muted hover:text-text">
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    "truncate",
                    index === breadcrumbItems.length - 1 ? "font-medium text-text" : "text-text-muted",
                  )}
                >
                  {item.label}
                </span>
              )}
            </span>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
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
        </div>
      </div>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1">
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
          <ResourcesRow task={task} />
          <SubtasksSection taskId={task.id} />
          <CommentsSection taskId={task.id} />
        </div>

        {panelOpen && (
          <aside className="flex w-full shrink-0 flex-col gap-4 lg:w-[340px]">
            <DetailsCard task={task} onSave={save} />
            <UpdatesCard taskId={task.id} />
          </aside>
        )}
      </div>
    </>
  );
}