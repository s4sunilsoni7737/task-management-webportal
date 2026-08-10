"use client";

import { useState } from "react";
import {
  ArrowRightLeft,
  CalendarClock,
  ChevronDown,
  Flag,
  ListPlus,
  MessageCircle,
  PencilLine,
  Sparkles,
  Tag,
  UserPlus,
} from "lucide-react";
import { useActivity } from "../../../../hooks/useTaskDetail";
import { formatRelativeTime } from "../../../../lib/utils/formatters";
import type { ActivityLogEntry, ActivityType } from "../../../../lib/types";

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

/** Right-panel "Updates" card â€” chronological activity feed, per design_break_down.md Â§12. */
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
