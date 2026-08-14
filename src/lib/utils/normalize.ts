/**
 * Normalization layer — the single place where the backends raw Mongo/lean
 * payload shapes are mapped to the UI-facing types in `lib/types`.
 *
 * `request()` in `services/api/api-handler.ts` already converts `_id` → `id`
 * recursively, so these helpers only handle *field-name / nesting* mapping:
 *  - user: top-level `theme`/`colorMode` → nested `preferences` (backend `_buildAuthResponse`
 *    sends `preferences` but `GET /users/me` returns the lean doc with top-level fields)
 *  - task: `memberIds`/`labelIds`/`reporterId` (populated objects) → `members`/`labels`/`reporter`,
 *    `teamId` → `team`, `dueDate`/`endDate` → `dueDate`
 *  - project: `leadId` (populated) → `lead`
 *  - comment: `authorId` (populated) → `author`
 *  - activity: `actorId` (populated) → `actor`
 */

import type {
  ActivityLogEntry,
  Comment,
  Label,
  Member,
  Project,
  Task,
  User,
} from "@/lib/types";

type Raw = Record<string, unknown>;

const str = (v: unknown): string =>
  typeof v === "string" ? v : v === null || v === undefined ? "" : String(v);
const strOpt = (v: unknown): string | null =>
  v === null || v === undefined || v === "" ? null : String(v);
const bool = (v: unknown): boolean => Boolean(v);
const num = (v: unknown): number => Number(v) || 0;

function idOf(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    const obj = value as Raw;
    return typeof obj.id === "string" ? obj.id : typeof obj._id === "string" ? obj._id : "";
  }
  return String(value);
}

export function normalizeMember(raw: unknown): Member {
  const obj = (raw ?? {}) as Raw;
  return {
    id: idOf(obj.id ?? obj._id),
    name: str(obj.name) || "Unknown",
    email: str(obj.email),
    avatarUrl: strOpt(obj.avatarUrl ?? obj.avatar),
    role: typeof obj.role === "string" ? obj.role : undefined,
  };
}

export function normalizeLabel(raw: unknown): Label {
  const obj = (raw ?? {}) as Raw;
  return {
    id: idOf(obj.id ?? obj._id),
    workspaceId: str(obj.workspaceId),
    name: str(obj.name),
    color: str(obj.color) || "#6366F1",
  };
}

/** Maps the raw user doc (or auth response `user`) to the UI `preferences` shape. */
export function normalizeUser(raw: unknown): User {
  const obj = (raw ?? {}) as Raw;
  const prefs =
    obj.preferences && typeof obj.preferences === "object" ? (obj.preferences as Raw) : {};
  return {
    id: idOf(obj.id ?? obj._id),
    name: str(obj.name) || "Guest",
    email: strOpt(obj.email),
    avatarUrl: strOpt(obj.avatarUrl),
    isGuest: bool(obj.isGuest ?? true),
    preferences: {
      theme:
        (typeof prefs.theme === "string" && (prefs.theme === "dark" || prefs.theme === "light")
          ? prefs.theme
          : typeof obj.theme === "string" && (obj.theme === "dark" || obj.theme === "light")
          ? obj.theme
          : "light"),
      colorMode: (() => {
        const mode = prefs.colorMode ?? obj.colorMode;
        return (typeof mode === "string" ? mode : "blue") as User["preferences"]["colorMode"];
      })(),
    },
  };
}

export function normalizeTask(raw: unknown): Task {
  const obj = (raw ?? {}) as Raw;
  return {
    id: idOf(obj.id ?? obj._id),
    workspaceId: strOpt(obj.workspaceId),
    projectId: strOpt(obj.projectId),
    parentTaskId: strOpt(obj.parentTaskId),
    title: str(obj.title),
    description: str(obj.description),
    status: str(obj.status) as Task["status"],
    priority: str(obj.priority) as Task["priority"],
    members: Array.isArray(obj.memberIds) ? (obj.memberIds as unknown[]).map(normalizeMember) : [],
    labels: Array.isArray(obj.labelIds) ? (obj.labelIds as unknown[]).map(normalizeLabel) : [],
    reporter: obj.reporterId ? normalizeMember(obj.reporterId) : null,
    team: strOpt(obj.team ?? obj.teamId),
    startDate: strOpt(obj.startDate),
    dueDate: strOpt(obj.dueDate ?? obj.endDate),
    createdAt: str(obj.createdAt),
    updatedAt: str(obj.updatedAt),
    resources: Array.isArray(obj.resources)
      ? (obj.resources as { _id?: unknown; id?: unknown; name?: unknown; url?: unknown; addedAt?: unknown }[]).map((r) => ({
          id: idOf(r.id ?? r._id),
          name: str(r.name),
          url: str(r.url),
          addedAt: str(r.addedAt),
        }))
      : [],
    subtaskCount: num(obj.subtaskCount),
    commentCount: num(obj.commentCount),
    isLocked: bool(obj.isLocked),
    watcherCount: num(obj.watcherCount),
  };
}

export function normalizeProject(raw: unknown): Project {
  const obj = (raw ?? {}) as Raw;
  return {
    id: idOf(obj.id ?? obj._id),
    workspaceId: str(obj.workspaceId),
    name: str(obj.name),
    description: str(obj.description),
    priority: str(obj.priority) as Project["priority"],
    lead: obj.leadId ? normalizeMember(obj.leadId) : null,
    dueDate: strOpt(obj.dueDate),
    createdAt: str(obj.createdAt),
    taskCount: num(obj.taskCount),
  };
}

export function normalizeComment(raw: unknown): Comment {
  const obj = (raw ?? {}) as Raw;
  return {
    id: idOf(obj.id ?? obj._id),
    taskId: str(obj.taskId),
    author: normalizeMember(obj.authorId),
    body: str(obj.body),
    attachments: Array.isArray(obj.attachments)
      ? (obj.attachments as { name?: unknown; url?: unknown }[]).map((a) => ({
          name: str(a.name),
          url: str(a.url),
        }))
      : [],
    createdAt: str(obj.createdAt),
  };
}

export function normalizeActivityLogEntry(raw: unknown): ActivityLogEntry {
  const obj = (raw ?? {}) as Raw;
  return {
    id: idOf(obj.id ?? obj._id),
    taskId: str(obj.taskId),
    actor: obj.actorId ? normalizeMember(obj.actorId) : null,
    type: str(obj.type) as ActivityLogEntry["type"],
    fromValue: strOpt(obj.fromValue),
    toValue: strOpt(obj.toValue),
    message: str(obj.message),
    createdAt: str(obj.createdAt),
  };
}

export function normalizeTaskList(raw: unknown): Task[] {
  return ((raw ?? []) as unknown[]).map(normalizeTask);
}

export function normalizeProjectList(raw: unknown): Project[] {
  return ((raw ?? []) as unknown[]).map(normalizeProject);
}