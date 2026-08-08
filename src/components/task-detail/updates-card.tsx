"use client";

import { useState } from "react";
import { ChevronDown, MessageCircle, ArrowRightLeft, Flag, CalendarClock, Sparkles } from "lucide-react";
import { useActivity } from "../../hooks/useTaskDetail";
import { formatRelativeTime } from "../../lib/utils/formatters";
import type { ActivityLogEntry, ActivityType } from "../../lib/types";

const ACTIVITY_ICONS: Record<ActivityType, typeof Flag> = {
  status_change: ArrowRightLeft,
  priority_change: Flag,
  comment: MessageCircle,
  member_added: Sparkles,
  member_removed: Sparkles,
  label_added: Sparkles,
  label_removed: Sparkles,
  date_change: CalendarClock,
  created: Sparkles,
};

function describeActivity(entry: ActivityLogEntry): string {
  switch (entry.type) {
    case "status_change":
      return `Changed status from ${entry.fromValue} to ${entry.toValue}`;
    case "priority_change":
      return `Changed priority from ${entry.fromValue ?? "No priority"} to ${entry.toValue}`;
    case "date_change":
      return `Updated due date to ${entry.toValue ?? "none"}`;
    case "comment":
      return "Posted an update";
    case "created":
      return `Created "${entry.toValue}"`;
    default:
      return "Updated the task";
  }
}

/** Right-panel "Updates" card — chronological activity feed, per design_break_down.md §12. */
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
