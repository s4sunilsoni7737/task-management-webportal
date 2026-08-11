"use client";

import { useRef, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { parseISO } from "date-fns";
import {
  ArrowRightLeft,
  CalendarClock,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleDot,
  Eye,
  Flag,
  ListPlus,
  Lock,
  LockOpen,
  MessageCircle,
  MessageSquare,
  MoreHorizontal,
  PanelRight,
  Paperclip,
  PencilLine,
  Plus,
  SendHorizontal,
  Settings,
  Share2,
  Smile,
  Sparkles,
  Tag,
  Trash2,
  UserCircle,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { Avatar, AvatarStack } from "@/components/ui/avatar";
import { DateChip, LabelChip, PriorityBadge, StatusBadge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { CollapsiblePanel } from "@/components/ui/collapsible-panel";
import { EmptyState } from "@/components/ui/empty-state";
import { GlobalLoader } from "@/components/ui/global-loader";
import { IconButton } from "@/components/ui/icon-button";
import { MemberPicker } from "@/components/ui/member-picker";
import { MenuItem, OverflowMenu } from "@/components/ui/menu";
import { Popover } from "@/components/ui/popover";
import { QueryErrorCard } from "@/components/ui/query-error-card";
import { InlineAddTaskRow } from "@/components/tasks/inline-add-task-row";
import { PriorityPopover } from "@/components/tasks/priority-popover";
import { TaskTable } from "@/components/tasks/task-table";
import { DEFAULT_TASK_FIELDS } from "@/components/tasks/task-fields";
import { useAuthStore } from "@/store/authStore";
import { toast } from "@/store/toastStore";
import { useLabels, useMembers } from "@/hooks/useLookups";
import {
  useAddComment,
  useAddSubtask,
  useActivity,
  useComments,
  useDeleteComment,
  useUpdateComment,
} from "@/hooks/useTaskDetail";
import { useDeleteTask, useSubtasks, useTask, useUpdateTask } from "@/hooks/useTasks";
import { tasksService } from "@/services/tasks/tasks.service";
import { routes } from "@/lib/routeBuilder";
import { cn } from "@/lib/utils";
import { STATUS_CONFIG } from "@/lib/utils/enum-utils";
import { formatRelativeTime } from "@/lib/utils/formatters";
import { DEFAULT_WORKSPACE_NAME } from "@/constants";
import { TASK_STATUSES } from "@/lib/types";
import type {
  ActivityLogEntry,
  ActivityType,
  Comment,
  Label,
  Member,
  Task,
  TaskStatus,
  UpdateTaskInput,
} from "@/lib/types";
type FieldKey = "status" | "priority" | "members" | "dates" | "labels" | "reporter" | null;

const ACTIVITY_ICONS: Record<ActivityType, typeof Flag> = {
  created: Sparkles,
  status_change: ArrowRightLeft,
  priority_change: Flag,
  assignee_change: UserPlus,
  due_date_change: CalendarClock,
  label_change: Tag,
  title_change: PencilLine,
  description_change: PencilLine,
  comment: MessageCircle,
  subtask_added: ListPlus,
};

function describeActivity(entry: ActivityLogEntry): string {
  // The backend already writes a human-readable message, e.g.
  // "You changed priority from No priority to Urgent".
  if (entry.message) return entry.message;

  switch (entry.type) {
    case "status_change":
      return `Changed status to ${entry.toValue ?? "unknown"}`;
    case "priority_change":
      return `Changed priority to ${entry.toValue ?? "No priority"}`;
    case "due_date_change":
      return `Updated due date to ${entry.toValue ?? "none"}`;
    case "assignee_change":
      return "Updated the assigned members";
    case "label_change":
      return "Updated the labels";
    case "title_change":
      return "Updated the task title";
    case "description_change":
      return "Updated the description";
    case "subtask_added":
      return "Added a subtask";
    case "comment":
      return "Posted an update";
    default:
      return "Updated the task";
  }
}

function toIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

interface DetailRowProps {
  icon: ComponentType<{ className?: string }>;
  label: string;
  children: ReactNode;
}

/** Generic left icon/label + right value row, reused for every field in the Details card. */
function DetailRow({ icon: Icon, label, children }: DetailRowProps) {
  return (
    <div className="flex min-h-[34px] items-center gap-2 py-1">
      <div className="flex w-24 shrink-0 items-center gap-1.5 text-xs text-text-subtle">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

interface StatusPopoverProps {
  open: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement>;
  value: TaskStatus;
  onChange: (status: TaskStatus) => void;
}

/** Status selector popover — To Do, Doing, Completed, On Hold — for the Details panel Status field. */
function StatusPopover({ open, onClose, anchorRef, value, onChange }: StatusPopoverProps) {
  return (
    <Popover open={open} onClose={onClose} anchorRef={anchorRef} align="start" className="w-[170px] p-1">
      <p className="px-2.5 py-1.5 text-xs font-medium text-text-subtle">Status</p>
      {TASK_STATUSES.map((status) => {
        const config = STATUS_CONFIG[status];
        return (
          <MenuItem
            key={status}
            iconNode={
              <config.icon
                className="h-3.5 w-3.5 shrink-0"
                style={{ color: `var(${config.colorVar})` }}
              />
            }
            label={config.label}
            selected={value === status}
            onClick={() => {
              onChange(status);
              onClose();
            }}
          />
        );
      })}
    </Popover>
  );
}
interface LabelPickerProps {
  open: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement>;
  labels: Label[];
  selectedIds: string[];
  onToggle: (labelId: string) => void;
}

/** Popover label picker used by the Labels row's "+" trigger. */
function LabelPicker({ open, onClose, anchorRef, labels, selectedIds, onToggle }: LabelPickerProps) {
  return (
    <Popover open={open} onClose={onClose} anchorRef={anchorRef} align="start" className="w-[180px] p-1">
      <p className="px-2.5 py-1.5 text-xs font-medium text-text-subtle">Labels</p>
      {labels.map((label) => {
        const selected = selectedIds.includes(label.id);
        return (
          <button
            key={label.id}
            type="button"
            onClick={() => onToggle(label.id)}
            className="flex h-8 w-full items-center gap-2 rounded-sm px-2.5 text-left text-sm text-text transition-colors hover:bg-surface-muted"
          >
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: label.color }} />
            <span className="flex-1 truncate">{label.name}</span>
            {selected && <Check className="h-3.5 w-3.5 shrink-0 text-accent" />}
          </button>
        );
      })}
    </Popover>
  );
}

interface ReporterPickerProps {
  open: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement>;
  members: Member[];
  selectedId: string | null;
  onSelect: (memberId: string) => void;
}

/** Single-select member popover for the Details panel Reporter field. */
function ReporterPicker({ open, onClose, anchorRef, members, selectedId, onSelect }: ReporterPickerProps) {
  return (
    <Popover open={open} onClose={onClose} anchorRef={anchorRef} align="start" className="w-[190px] p-1">
      <p className="px-2.5 py-1.5 text-xs font-medium text-text-subtle">Reporter</p>
      {members.map((member) => (
        <button
          key={member.id}
          type="button"
          onClick={() => {
            onSelect(member.id);
            onClose();
          }}
          className="flex h-8 w-full items-center gap-2 rounded-sm px-2.5 text-left text-sm text-text transition-colors hover:bg-surface-muted"
        >
          <Avatar name={member.name} size="xs" />
          <span className="flex-1 truncate">{member.name}</span>
          {selectedId === member.id && <Check className="h-3.5 w-3.5 shrink-0 text-accent" />}
        </button>
      ))}
    </Popover>
  );
}
interface DatePickerPopoverProps {
  open: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement>;
  startDate: string | null;
  endDate: string | null;
  onChange: (range: { startDate: string; endDate: string }) => void;
}

/** Date range popover for the Details panel Dates field. */
function DatePickerPopover({ open, onClose, anchorRef, startDate, endDate, onChange }: DatePickerPopoverProps) {
  const initialMonth = endDate ? parseISO(endDate) : startDate ? parseISO(startDate) : new Date();
  const [month, setMonth] = useState(initialMonth);
  const [pendingStart, setPendingStart] = useState<Date | null>(startDate ? parseISO(startDate) : null);

  const selectedStart = pendingStart;
  const selectedEnd = endDate ? parseISO(endDate) : null;

  function handleSelect(day: Date) {
    if (!pendingStart || (selectedEnd && day < pendingStart)) {
      setPendingStart(day);
      onChange({ startDate: toIso(day), endDate: toIso(day) });
      return;
    }

    if (day < pendingStart) {
      onChange({ startDate: toIso(day), endDate: toIso(pendingStart) });
    } else {
      onChange({ startDate: toIso(pendingStart), endDate: toIso(day) });
    }
    setPendingStart(null);
    onClose();
  }

  return (
    <Popover open={open} onClose={onClose} anchorRef={anchorRef} align="start" className="p-0">
      <Calendar
        month={month}
        onMonthChange={setMonth}
        selectedStart={selectedStart}
        selectedEnd={selectedEnd}
        onSelectDate={handleSelect}
      />
    </Popover>
  );
}

interface TaskHeaderProps {
  task: Task;
  onSave: (input: UpdateTaskInput) => void;
}

/** Editable task title + description. */
function TaskHeader({ task, onSave }: TaskHeaderProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  return (
    <div className="mb-5">
      <textarea
        value={title}
        rows={1}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={() => {
          if (title.trim() && title !== task.title) onSave({ title: title.trim() });
          else setTitle(task.title);
        }}
        className="w-full resize-none overflow-hidden border-none bg-transparent text-xl font-bold text-text outline-none"
      />
      <textarea
        value={description}
        rows={2}
        placeholder="Add a description..."
        onChange={(e) => setDescription(e.target.value)}
        onBlur={() => {
          if (description !== task.description) onSave({ description });
        }}
        className="mt-1 w-full resize-none border-none bg-transparent text-sm leading-relaxed text-text-muted outline-none placeholder:text-text-subtle"
      />
    </div>
  );
}

interface PropertiesRowProps {
  task: Task;
  onOpenDatePicker: () => void;
  dateAnchorRef: React.RefObject<HTMLDivElement>;
}

/** "Properties" row — reporter identity + due-date chip. */
function PropertiesRow({ task, onOpenDatePicker, dateAnchorRef }: PropertiesRowProps) {
  return (
    <div className="mb-4">
      <p className="mb-1.5 text-xs font-medium text-text-subtle">Properties</p>
      <div className="flex flex-wrap items-center gap-2">
        {task.reporter && (
          <div className="flex items-center gap-1.5 rounded-sm bg-surface-muted px-2 py-1 text-xs text-text-muted">
            <Avatar name={task.reporter.name} size="xs" />
            {task.reporter.name}
          </div>
        )}
        <div ref={dateAnchorRef}>
          <DateChip date={task.dueDate} onClick={onOpenDatePicker} />
        </div>
      </div>
    </div>
  );
}
interface LabelsRowProps {
  task: Task;
  onChange: (labelIds: string[]) => void;
}

/** "Labels" row — pill-style labels with an add/remove picker. */
function LabelsRow({ task, onChange }: LabelsRowProps) {
  const { data: allLabels = [] } = useLabels();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null!);

  function toggle(labelId: string) {
    const ids = task.labels.map((l) => l.id);
    onChange(ids.includes(labelId) ? ids.filter((id) => id !== labelId) : [...ids, labelId]);
  }

  return (
    <div className="mb-4">
      <p className="mb-1.5 text-xs font-medium text-text-subtle">Labels</p>
      <div className="flex flex-wrap items-center gap-1.5">
        {task.labels.map((label) => (
          <LabelChip key={label.id} label={label} onRemove={() => toggle(label.id)} />
        ))}
        <button
          ref={anchorRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Add label"
          className="flex h-[22px] w-[22px] items-center justify-center rounded-full border border-dashed border-border-strong text-text-subtle transition-colors hover:border-accent hover:text-accent"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>
      <LabelPicker
        open={open}
        onClose={() => setOpen(false)}
        anchorRef={anchorRef}
        labels={allLabels}
        selectedIds={task.labels.map((l) => l.id)}
        onToggle={toggle}
      />
    </div>
  );
}

/** "Resources" row — lets the user attach a document/link by name + URL. */
function ResourcesRow({ taskId }: { taskId: string }) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [pending, setPending] = useState(false);

  function submit() {
    const trimmedName = name.trim();
    const trimmedUrl = url.trim();
    if (!trimmedName || !trimmedUrl) return;
    setPending(true);
    tasksService
      .addResource(taskId, { name: trimmedName, url: trimmedUrl })
      .then(() => {
        toast.success("Resource attached");
        setName("");
        setUrl("");
        setAdding(false);
      })
      .catch(() => toast.error("Couldn't attach resource"))
      .finally(() => setPending(false));
  }

  return (
    <div className="mb-5">
      <p className="mb-1.5 text-xs font-medium text-text-subtle">Resources</p>
      {adding ? (
        <div className="flex flex-col gap-2 rounded-sm border border-border p-2">
          <div className="flex items-center gap-2">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name (e.g. Design spec.pdf)"
              className="h-8 min-w-0 flex-1 rounded-sm border border-border bg-surface px-2 text-sm text-text outline-none placeholder:text-text-subtle"
            />
            <button
              type="button"
              aria-label="Cancel"
              onClick={() => {
                setAdding(false);
                setName("");
                setUrl("");
              }}
              className="flex h-7 w-7 items-center justify-center rounded-sm text-text-subtle hover:bg-surface-muted hover:text-text"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
              }}
              placeholder="https://..."
              className="h-8 min-w-0 flex-1 rounded-sm border border-border bg-surface px-2 text-sm text-text outline-none placeholder:text-text-subtle"
            />
            <button
              type="button"
              onClick={submit}
              disabled={pending || !name.trim() || !url.trim()}
              className="h-8 rounded-sm bg-accent px-3 text-sm font-medium text-white transition-opacity disabled:opacity-50"
            >
              {pending ? "Adding…" : "Add"}
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="flex h-9 w-full items-center gap-2 rounded-sm border border-dashed border-border px-2.5 text-left text-sm text-text-subtle transition-colors hover:border-accent hover:text-accent"
        >
          <Paperclip className="h-3.5 w-3.5" />
          Add document or link...
        </button>
      )}
    </div>
  );
}
interface CommentComposerProps {
  onSubmit: (body: string) => void;
  pending?: boolean;
  placeholder?: string;
  compact?: boolean;
}

/** Full-width bordered comment input with attachment + send icons. */
function CommentComposer({ onSubmit, pending, placeholder = "Add a comment...", compact }: CommentComposerProps) {
  const user = useAuthStore((s) => s.user);
  const [value, setValue] = useState("");

  function submit() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setValue("");
  }

  return (
    <div className={`flex items-center gap-2.5 rounded-md border border-border bg-surface px-3 ${compact ? "h-10" : "h-[52px]"}`}>
      {compact && <Avatar name={user?.name ?? DEFAULT_WORKSPACE_NAME} size="xs" />}
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        placeholder={placeholder}
        disabled={pending}
        className="min-w-0 flex-1 bg-transparent text-sm text-text outline-none placeholder:text-text-subtle"
      />
      <button
        type="button"
        aria-label="Attach file"
        disabled
        className="flex h-7 w-7 items-center justify-center rounded-sm text-text-subtle disabled:cursor-not-allowed"
      >
        <Paperclip className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        aria-label="Send comment"
        onClick={submit}
        disabled={pending || !value.trim()}
        className="flex h-7 w-7 items-center justify-center rounded-sm text-accent transition-colors hover:bg-accent-soft disabled:cursor-not-allowed disabled:text-text-subtle disabled:hover:bg-transparent"
      >
        <SendHorizontal className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

interface CommentItemProps {
  comment: Comment;
  taskId: string;
}

/** Single comment card — avatar, author, relative timestamp, body, and reaction/overflow affordance. */
function CommentItem({ comment, taskId }: CommentItemProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(comment.body);
  const updateComment = useUpdateComment(taskId, comment.id);
  const deleteComment = useDeleteComment(taskId, comment.id);

  function saveEdit() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== comment.body) {
      updateComment.mutate(trimmed);
    }
    setEditing(false);
  }

  return (
    <div className="flex gap-2.5 py-3">
      <Avatar name={comment.author.name} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-text">{comment.author.name}</span>
          <span className="text-xs text-text-subtle">{formatRelativeTime(comment.createdAt)}</span>
        </div>
        {editing ? (
          <textarea
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                saveEdit();
              }
              if (e.key === "Escape") {
                setDraft(comment.body);
                setEditing(false);
              }
            }}
            className="mt-0.5 w-full resize-none rounded-sm border border-accent bg-surface px-2 py-1 text-sm text-text outline-none"
          />
        ) : (
          <p className="mt-0.5 text-sm text-text-muted">{comment.body}</p>
        )}
      </div>
      <div className="flex shrink-0 items-start gap-1">
        <button
          type="button"
          aria-label="Add reaction"
          className="flex h-7 w-7 items-center justify-center rounded-sm text-text-subtle hover:bg-surface-muted hover:text-text"
        >
          <Smile className="h-3.5 w-3.5" />
        </button>
        <OverflowMenu
          label={`Actions for comment by ${comment.author.name}`}
          onEdit={() => {
            setDraft(comment.body);
            setEditing(true);
          }}
          onDelete={() => deleteComment.mutate()}
        />
      </div>
    </div>
  );
}
/** Comments/discussion area — list, inline reply row, and the primary composer. */
function CommentsSection({ taskId }: { taskId: string }) {
  const { data: comments = [], isLoading } = useComments(taskId);
  const addComment = useAddComment(taskId);

  return (
    <CollapsiblePanel title="Comments" count={comments.length} defaultOpen>
      {isLoading ? (
        <div className="h-24 animate-pulse rounded-md bg-surface-muted" />
      ) : (
        <div className="rounded-md border border-border">
          {comments.length === 0 ? (
            <EmptyState icon={MessageSquare} title="No comments yet" description="Start the discussion below." />
          ) : (
            <div className="divide-y divide-border px-3">
              {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} taskId={taskId} />
              ))}
            </div>
          )}
          <div className="border-t border-border p-2.5">
            <CommentComposer
              compact
              placeholder="Leave a reply..."
              pending={addComment.isPending}
              onSubmit={(body) => addComment.mutate(body)}
            />
          </div>
        </div>
      )}

      <div className="mt-3">
        <CommentComposer pending={addComment.isPending} onSubmit={(body) => addComment.mutate(body)} />
      </div>
    </CollapsiblePanel>
  );
}

/** "Subtasks" table — Task/Priority/Members/Due Date/Actions. */
function SubtasksSection({ taskId }: { taskId: string }) {
  const { data: subtasks = [], isLoading } = useSubtasks(taskId);
  const addSubtask = useAddSubtask(taskId);

  return (
    <CollapsiblePanel title="Subtasks" count={subtasks.length} defaultOpen className="mb-5">
      {isLoading ? (
        <div className="h-20 animate-pulse rounded-md bg-surface-muted" />
      ) : subtasks.length === 0 ? (
        <div className="rounded-md border border-dashed border-border">
          <EmptyState title="No subtasks yet" />
          <div className="border-t border-border px-1 py-1">
            <InlineAddTaskRow
              label="Add Subtasks"
              pending={addSubtask.isPending}
              onAdd={(title) => addSubtask.mutate(title)}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          <TaskTable tasks={subtasks} visibleFields={DEFAULT_TASK_FIELDS} />
          <InlineAddTaskRow
            label="Add Subtasks"
            pending={addSubtask.isPending}
            onAdd={(title) => addSubtask.mutate(title)}
          />
        </div>
      )}
    </CollapsiblePanel>
  );
}

/** Right-panel "Updates" card — chronological activity feed. */
function UpdatesCard({ taskId }: { taskId: string }) {
  const { data: activity = [], isLoading } = useActivity(taskId);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="rounded-md border border-border bg-surface">
      <div className="border-b border-border px-3 py-2.5">
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className="flex items-center gap-1.5 text-sm font-semibold text-text"
        >
          <ChevronDown className={`h-3.5 w-3.5 text-text-subtle transition-transform ${collapsed ? "-rotate-90" : ""}`} />
          Updates
        </button>
      </div>

      {!collapsed && (
        <div className="flex flex-col gap-3 p-3">
          {isLoading && <div className="h-16 animate-pulse rounded-md bg-surface-muted" />}
          {!isLoading && activity.length === 0 && (
            <p className="text-xs text-text-subtle">No updates yet.</p>
          )}
          {activity.map((entry) => {
            const Icon = ACTIVITY_ICONS[entry.type];
            return (
              <div key={entry.id} className="flex items-start gap-2.5">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-muted text-text-muted">
                  <Icon className="h-3 w-3" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-text">
                    <span className="font-medium">You</span>{" "}
                    <span className="text-text-muted">{describeActivity(entry)}</span>
                  </p>
                  <p className="mt-0.5 text-[11px] text-text-subtle">
                    {formatRelativeTime(entry.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
interface DetailsCardProps {
  task: Task;
  onSave: (input: UpdateTaskInput) => void;
}

/** Right-panel "Details" card — Status, Priority, Members, Dates, Labels, Teams, and Reporter fields. */
function DetailsCard({ task, onSave }: DetailsCardProps) {
  const { data: members = [] } = useMembers();
  const { data: labels = [] } = useLabels();
  const [collapsed, setCollapsed] = useState(false);
  const [openField, setOpenField] = useState<FieldKey>(null);
  const [team, setTeam] = useState(task.team ?? "");

  const statusRef = useRef<HTMLButtonElement>(null!);
  const priorityRef = useRef<HTMLButtonElement>(null!);
  const membersRef = useRef<HTMLDivElement>(null!);
  const datesRef = useRef<HTMLDivElement>(null!);
  const labelsRef = useRef<HTMLButtonElement>(null!);
  const reporterRef = useRef<HTMLButtonElement>(null!);

  function toggleMember(memberId: string) {
    const ids = task.members.map((m) => m.id);
    onSave({
      memberIds: ids.includes(memberId) ? ids.filter((id) => id !== memberId) : [...ids, memberId],
    });
  }

  function toggleLabel(labelId: string) {
    const ids = task.labels.map((l) => l.id);
    onSave({ labelIds: ids.includes(labelId) ? ids.filter((id) => id !== labelId) : [...ids, labelId] });
  }

  return (
    <div className="rounded-md border border-border bg-surface">
      <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className="flex items-center gap-1.5 text-sm font-semibold text-text"
        >
          <ChevronDown className={`h-3.5 w-3.5 text-text-subtle transition-transform ${collapsed ? "-rotate-90" : ""}`} />
          Details
        </button>
        <div className="ml-auto flex items-center gap-0.5">
          <button
            type="button"
            aria-label="Add field"
            className="flex h-6 w-6 items-center justify-center rounded-sm text-text-subtle hover:bg-surface-muted hover:text-text"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label="Details settings"
            className="flex h-6 w-6 items-center justify-center rounded-sm text-text-subtle hover:bg-surface-muted hover:text-text"
          >
            <Settings className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="divide-y divide-border px-3">
          <DetailRow icon={CircleDot} label="Status">
            <button
              ref={statusRef}
              type="button"
              onClick={() => setOpenField("status")}
              className="rounded-sm px-1.5 py-1 hover:bg-surface-muted"
            >
              <StatusBadge status={task.status} />
            </button>
            <StatusPopover
              open={openField === "status"}
              onClose={() => setOpenField(null)}
              anchorRef={statusRef}
              value={task.status}
              onChange={(status) => onSave({ status })}
            />
          </DetailRow>

          <DetailRow icon={Flag} label="Priority">
            <button
              ref={priorityRef}
              type="button"
              onClick={() => setOpenField("priority")}
              className="rounded-sm px-1.5 py-1 hover:bg-surface-muted"
            >
              <PriorityBadge priority={task.priority} />
            </button>
            <PriorityPopover
              open={openField === "priority"}
              onClose={() => setOpenField(null)}
              anchorRef={priorityRef}
              value={task.priority}
              onChange={(priority) => onSave({ priority })}
            />
          </DetailRow>

          <DetailRow icon={Users} label="Members">
            <div ref={membersRef}>
              <AvatarStack members={task.members} size="xs" onAdd={() => setOpenField("members")} />
            </div>
            <MemberPicker
              open={openField === "members"}
              onClose={() => setOpenField(null)}
              anchorRef={membersRef}
              members={members}
              selectedIds={task.members.map((m) => m.id)}
              onToggle={toggleMember}
            />
          </DetailRow>
<DetailRow icon={CalendarDays} label="Dates">
            <div ref={datesRef}>
              <DateChip date={task.dueDate} onClick={() => setOpenField("dates")} />
            </div>
            <DatePickerPopover
              open={openField === "dates"}
              onClose={() => setOpenField(null)}
              anchorRef={datesRef}
              startDate={task.startDate}
              endDate={task.dueDate}
              onChange={(range) => onSave(range)}
            />
          </DetailRow>

          <DetailRow icon={Tag} label="Labels">
            <div className="flex flex-wrap items-center gap-1">
              {task.labels.map((label) => (
                <LabelChip key={label.id} label={label} onRemove={() => toggleLabel(label.id)} />
              ))}
              <button
                ref={labelsRef}
                type="button"
                onClick={() => setOpenField("labels")}
                aria-label="Add label"
                className={
                  task.labels.length === 0
                    ? "text-xs text-text-subtle hover:text-text cursor-pointer transition-colors"
                    : "flex h-[20px] w-[20px] items-center justify-center rounded-full border border-dashed border-border-strong text-text-subtle hover:border-accent hover:text-accent"
                }
              >
                {task.labels.length === 0 ? "Add labels..." : <Plus className="h-2.5 w-2.5" />}
              </button>
            </div>
            <LabelPicker
              open={openField === "labels"}
              onClose={() => setOpenField(null)}
              anchorRef={labelsRef}
              labels={labels}
              selectedIds={task.labels.map((l) => l.id)}
              onToggle={toggleLabel}
            />
          </DetailRow>

          <DetailRow icon={UserCircle} label="Teams">
            <input
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              onBlur={() => {
                if (team !== (task.team ?? "")) onSave({ team: team || null });
              }}
              placeholder="Add team..."
              className="w-full bg-transparent text-sm text-text outline-none placeholder:text-text-subtle"
            />
          </DetailRow>

          <DetailRow icon={UserCircle} label="Reporter">
            <button
              ref={reporterRef}
              type="button"
              onClick={() => setOpenField("reporter")}
              className="flex items-center gap-1.5 rounded-sm px-1.5 py-1 hover:bg-surface-muted"
            >
              {task.reporter ? (
                <>
                  <Avatar name={task.reporter.name} size="xs" />
                  <span className="text-sm text-text">{task.reporter.name}</span>
                </>
              ) : (
                <span className="text-xs text-text-subtle">Unassigned</span>
              )}
            </button>
            <ReporterPicker
              open={openField === "reporter"}
              onClose={() => setOpenField(null)}
              anchorRef={reporterRef}
              members={members}
              selectedId={task.reporter?.id ?? null}
              onSelect={(reporterId) => onSave({ reporterId })}
            />
          </DetailRow>
        </div>
      )}
    </div>
  );
}
interface TaskDetailActionsProps {
  task: Task;
  onToggleLock: () => void;
  onDelete: () => void;
  panelOpen: boolean;
  onTogglePanel: () => void;
}

/** Right-aligned Task Detail top-bar actions — Lock, watcher count, Share, Overflow, Panel toggle. */
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
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
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

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
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
    </>
  );
}