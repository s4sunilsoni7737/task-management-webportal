"use client";

import { useRef, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import { parseISO } from "date-fns";
import {
  ArrowRightLeft,
  CalendarClock,
  CalendarDays,
  Check,
  ChevronDown,
  CircleDot,
  Flag,
  ListPlus,
  MessageCircle,
  PencilLine,
  Plus,
  Settings,
  Sparkles,
  Tag,
  UserCircle,
  UserPlus,
  Users,
} from "lucide-react";
import { Avatar, AvatarStack } from "@/components/ui/avatar";
import { DateChip, LabelChip, PriorityBadge, StatusBadge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { MemberPicker } from "@/components/ui/member-picker";
import { Popover } from "@/components/ui/popover";
import { PriorityPopover } from "@/components/tasks/priority-popover";
import { useLabels, useMembers } from "@/hooks/useLookups";
import { useActivity } from "@/hooks/useTaskDetail";
import { STATUS_CONFIG } from "@/lib/utils/enum-utils";
import { formatRelativeTime } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils";
import { TASK_STATUSES } from "@/lib/types";
import type {
  ActivityLogEntry,
  ActivityType,
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

function StatusPopover({ open, onClose, anchorRef, value, onChange }: StatusPopoverProps) {
  return (
    <Popover open={open} onClose={onClose} anchorRef={anchorRef} align="start" className="w-[180px] p-1.5">
      <div className="flex flex-col gap-0.5">
        <div className="px-2.5 py-1 text-xs text-text-muted">Status</div>
        {TASK_STATUSES.map((status) => {
          const config = STATUS_CONFIG[status];
          const Icon = config.icon;
          const isSelected = value === status;
          return (
            <button
              key={status}
              onClick={() => {
                onChange(status);
                onClose();
              }}
              className="flex items-center gap-2 rounded-sm px-2.5 py-1.5 text-sm hover:bg-surface-muted transition-colors text-text"
            >
              <Icon className="h-4 w-4 shrink-0" style={{ color: `var(${config.colorVar})` }} />
              <span className="flex-1 text-left">{config.label}</span>
              {isSelected && <Check className="h-4 w-4 text-text shrink-0" />}
            </button>
          );
        })}
      </div>
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

export function DatePickerPopover({ open, onClose, anchorRef, startDate, endDate, onChange }: DatePickerPopoverProps) {
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

export function UpdatesCard({ taskId }: { taskId: string }) {
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
  isEditing?: boolean;
}

export function DetailsCard({ task, onSave, isEditing }: DetailsCardProps) {
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
        {isEditing && (
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
        )}
      </div>

      {!collapsed && (
        <div className="divide-y divide-border px-3">
          <DetailRow icon={CircleDot} label="Status">
            <button
              ref={statusRef}
              type="button"
              onClick={() => isEditing && setOpenField("status")}
              className={cn("rounded-sm px-1.5 py-1", isEditing ? "hover:bg-surface-muted" : "cursor-default")}
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
              onClick={() => isEditing && setOpenField("priority")}
              className={cn("rounded-sm px-1.5 py-1", isEditing ? "hover:bg-surface-muted" : "cursor-default")}
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
              <AvatarStack members={task.members} size="xs" onAdd={() => isEditing && setOpenField("members")} />
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
            <div
              ref={datesRef}
              onClick={() => isEditing && setOpenField("dates")}
              className={cn("w-fit", isEditing && "cursor-pointer")}
            >
              <DateChip date={task.dueDate} />
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
                onClick={() => isEditing && setOpenField("labels")}
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
            {isEditing ? (
              <input
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                onBlur={() => {
                  if (team !== (task.team ?? "")) onSave({ team: team || null });
                }}
                placeholder="Add team..."
                className="w-full bg-transparent text-sm text-text outline-none placeholder:text-text-subtle focus:ring-1 focus:ring-accent rounded-sm px-1"
              />
            ) : (
              <span className="text-sm text-text px-1">{task.team || <span className="text-text-subtle">None</span>}</span>
            )}
          </DetailRow>

          <DetailRow icon={UserCircle} label="Reporter">
            <button
              ref={reporterRef}
              type="button"
              onClick={() => isEditing && setOpenField("reporter")}
              className={cn("flex items-center gap-1.5 rounded-sm px-1.5 py-1", isEditing ? "hover:bg-surface-muted" : "cursor-default")}
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
