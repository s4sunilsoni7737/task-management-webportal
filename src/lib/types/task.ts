import type { Priority, TaskStatus } from "@/lib/types/enums";
import type { Label } from "@/lib/types/label";
import type { Member } from "@/lib/types/user";

/**
 * UI-facing Task shape. The backend doctrine persists `_id`, `memberIds`,
 * `labelIds`, `reporterId`, `teamId`, and `dueDate`; `normalizeTask()` in
 * `lib/utils/normalize.ts` maps those raw fields onto this interface at the
 * service edge so every component only ever sees this clean shape.
 */
export interface Task {
  id: string;
  workspaceId: string | null;
  projectId: string | null;
  parentTaskId: string | null;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  members: Member[];
  labels: Label[];
  reporter: Member | null;
  team: string | null; // backend field: `teamId`
  startDate: string | null; // ISO date
  dueDate: string | null; // ISO date (backend `dueDate`/`endDate`)
  createdAt: string;
  updatedAt: string;
  subtaskCount: number;
  commentCount: number;
  isLocked: boolean;
  watcherCount: number;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  workspaceId?: string;
  projectId?: string | null;
  parentTaskId?: string | null;
  status?: TaskStatus;
  priority?: Priority;
  memberIds?: string[];
  labelIds?: string[];
  reporterId?: string;
  dueDate?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  isLocked?: boolean;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  projectId?: string | null;
  status?: TaskStatus;
  priority?: Priority;
  memberIds?: string[];
  labelIds?: string[];
  reporterId?: string | null;
  team?: string | null; // maps to backend `teamId` (DTO also accepts `team` alias)
  startDate?: string | null;
  endDate?: string | null;
  dueDate?: string | null;
  isPrivate?: boolean;
  isLocked?: boolean;
}

/**
 * Server-side query params for `GET /tasks`. `q` is the search term,
 * pagination/sort map 1:1 to the backend `QueryParamsDto`.
 */
export interface TaskQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  q?: string;
  workspaceId?: string;
  projectId?: string;
  status?: TaskStatus;
  priority?: Priority;
  memberId?: string;
  labelId?: string;
  reporterId?: string;
  teamId?: string;
  dueDate?: string;
  topLevelOnly?: boolean;
}

/** Result of `getGrouped()` — tasks keyed by status (backend `groupByStatus=true`). */
export interface GroupedTasks {
  grouped: Partial<Record<TaskStatus, Task[]>>;
  total: number;
}

export interface Comment {
  id: string;
  taskId: string;
  author: Member;
  body: string;
  attachments: { name: string; url: string }[];
  createdAt: string;
}

export interface ActivityLogEntry {
  id: string;
  taskId: string;
  actor: Member | null;
  type: import("@/lib/types/enums").ActivityType;
  fromValue: string | null;
  toValue: string | null;
  message: string;
  createdAt: string;
}
