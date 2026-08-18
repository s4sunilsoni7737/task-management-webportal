"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronRight, Lock, LockOpen, MoreHorizontal, PanelRight, Share2, Trash2, Eye, Pencil } from "lucide-react";
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
  isEditing: boolean;
  setEditing: (editing: boolean) => void;
}

function TaskDetailActions({
  task,
  onToggleLock,
  onDelete,
  panelOpen,
  onTogglePanel,
  isEditing,
  setEditing,
}: TaskDetailActionsProps) {
  const [overflowOpen, setOverflowOpen] = useState(false);
  const overflowRef = useRef<HTMLButtonElement>(null!);

  return (
    <>
      <IconButton aria-label={task.isLocked ? "Unlock task" : "Lock task"} onClick={onToggleLock}>
        {task.isLocked ? <Lock className="h-4 w-4" /> : <LockOpen className="h-4 w-4" />}
      </IconButton>

      <div
        className="flex h-8 items-center gap-1 rounded-sm px-2 text-text-muted"
        title={`${task.viewerCount} views`}
      >
        <Eye className="h-4 w-4" />
        <span className="text-xs">{task.viewerCount}</span>
      </div>

      <IconButton
        aria-label="Share task"
        onClick={() => {
          navigator.clipboard?.writeText(window.location.href).catch(() => {});
          toast.success("Link copied to clipboard");
        }}
      >
        <Share2 className="h-4 w-4" />
      </IconButton>

      {!isEditing && !task.isLocked && (
        <IconButton aria-label="Edit task" onClick={() => setEditing(true)}>
          <Pencil className="h-4 w-4" />
        </IconButton>
      )}

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

      {isEditing && (
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="ml-2 flex h-8 items-center justify-center rounded-sm bg-accent px-3 text-xs font-semibold text-accent-fg hover:bg-accent-hover transition-colors"
        >
          Done Editing
        </button>
      )}
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
  const [isEditing, setIsEditing] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const dateAnchorRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    if (taskId) {
      tasksService.recordView(taskId).catch(() => {});
    }
  }, [taskId]);

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
            isEditing={isEditing}
            setEditing={setIsEditing}
          />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto px-6 py-6 md:px-10 lg:px-14">
          <div className="mx-auto max-w-4xl pb-20">
            <TaskHeader task={task} onSave={save} isEditing={isEditing} setEditing={setIsEditing} />

            <div className="mb-10">
              <PropertiesRow task={task} onOpenDatePicker={() => isEditing && setDatePickerOpen(true)} dateAnchorRef={dateAnchorRef} />
              <LabelsRow task={task} onChange={(labelIds) => save({ labelIds })} isEditing={isEditing} />
              <ResourcesRow task={task} isEditing={isEditing} />
            </div>

            <DatePickerPopover
              open={datePickerOpen}
              onClose={() => setDatePickerOpen(false)}
              anchorRef={dateAnchorRef}
              startDate={task.startDate}
              endDate={task.dueDate}
              onChange={(range) => save(range)}
            />

            <SubtasksSection task={task} isEditing={isEditing} />
            <CommentsSection taskId={task.id} />
          </div>
        </div>

        {panelOpen && (
          <div className="w-[340px] shrink-0 border-l border-border bg-bg overflow-y-auto hidden md:block">
            <div className="flex flex-col gap-5 p-5">
              <DetailsCard task={task} onSave={save} isEditing={isEditing} />
              <UpdatesCard taskId={task.id} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}