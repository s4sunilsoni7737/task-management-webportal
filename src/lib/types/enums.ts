/**
 * Enum-like unions shared between the frontend and the (future) NestJS
 * backend. Keeping these as string unions (rather than TS `enum`) keeps
 * them trivially serializable over JSON and easy to mirror in Mongoose
 * schema enums on the backend.
 */

export const TASK_STATUSES = ["todo", "doing", "completed", "on_hold"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To Do",
  doing: "Doing",
  completed: "Completed",
  on_hold: "On Hold",
};

export const PRIORITIES = ["no_priority", "urgent", "high", "medium", "low"] as const;
export type Priority = (typeof PRIORITIES)[number];

export const PRIORITY_LABELS: Record<Priority, string> = {
  no_priority: "No Priority",
  urgent: "Urgent",
  high: "High",
  medium: "Medium",
  low: "Low",
};

/** Priorities used on Projects (no "no priority"/"urgent" per design breakdown). */
export const PROJECT_PRIORITIES = ["high", "medium", "low"] as const;
export type ProjectPriority = (typeof PROJECT_PRIORITIES)[number];

export type ThemeMode = "light" | "dark";

export const COLOR_MODES = [
  "amber",
  "blue",
  "pink",
  "rose",
  "emerald",
  "black",
] as const;
export type ColorMode = (typeof COLOR_MODES)[number];

export type ActivityType =
  | "status_change"
  | "priority_change"
  | "comment"
  | "member_added"
  | "member_removed"
  | "label_added"
  | "label_removed"
  | "date_change"
  | "created";
