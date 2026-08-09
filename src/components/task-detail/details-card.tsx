"use client";

import { useRef, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  CircleDot,
  Flag,
  Plus,
  Settings,
  Tag,
  UserCircle,
  Users,
} from "lucide-react";
import { DetailRow } from "./detail-row";
import { StatusBadge } from "../ui/status-badge";
import { PriorityBadge } from "../ui/priority-badge";
import { LabelChip } from "../ui/label-chip";
import { DateChip } from "../ui/date-chip";
import { Avatar } from "../ui/avatar";
import { AvatarStack } from "../ui/avatar-stack";
import { StatusPopover } from "./status-popover";
import { PriorityPopover } from "../tasks/priority-popover";
import { MemberPicker } from "../ui/member-picker";
import { LabelPicker } from "./label-picker";
import { ReporterPicker } from "./reporter-picker";
import { DatePickerPopover } from "./date-picker-popover";
import { useMembers, useLabels } from "../../hooks/useLookups";
import type { Task, UpdateTaskInput } from "../../lib/types";

type FieldKey = "status" | "priority" | "members" | "dates" | "labels" | "reporter" | null;

interface DetailsCardProps {
  task: Task;
  onSave: (input: UpdateTaskInput) => void;
}

/**
 * Right-panel "Details" card — Status, Priority, Members, Dates, Labels,
 * Teams, and Reporter fields, per design_break_down.md §7.
 */
export function DetailsCard({ task, onSave }: DetailsCardProps) {
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
              {task.labels.length === 0 && <span className="text-xs text-text-subtle">Add labels...</span>}
              {task.labels.map((label) => (
                <LabelChip key={label.id} label={label} onRemove={() => toggleLabel(label.id)} />
              ))}
              <button
                ref={labelsRef}
                type="button"
                onClick={() => setOpenField("labels")}
                aria-label="Add label"
                className="flex h-[20px] w-[20px] items-center justify-center rounded-full border border-dashed border-border-strong text-text-subtle hover:border-accent hover:text-accent"
              >
                <Plus className="h-2.5 w-2.5" />
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
