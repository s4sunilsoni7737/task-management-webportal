/**
 * Enum-like unions shared between the frontend and the NestJS backend.
 * Keeping these as string unions (rather than TS `enum`) keeps them
 * trivially serializable over JSON and easy to mirror in Mongoose
 * schema enums on the backend.
 *
 * Every value below mirrors `src/enums/*` in `task-management-api`.
 */

export const TASK_STATUSES = [
  "backlog",
  "todo",
  "doing",
  "on_hold",
  "completed",
] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  backlog: "Backlog",
  todo: "To Do",
  doing: "Doing",
  on_hold: "On Hold",
  completed: "Completed",
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
  | "created"
  | "status_change"
  | "priority_change"
  | "assignee_change"
  | "due_date_change"
  | "label_change"
  | "title_change"
  | "description_change"
  | "comment"
  | "subtask_added";
