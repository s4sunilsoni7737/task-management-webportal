import type { Priority, TaskStatus } from "./enums";
import type { Label } from "./label";
import type { Member } from "./user";

export interface Task {
  id: string;
  projectId: string | null;
  parentTaskId: string | null;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  members: Member[];
  labels: Label[];
  reporter: Member | null;
  team: string | null;
  startDate: string | null; // ISO date
  endDate: string | null; // ISO date (a.k.a. due date)
  createdAt: string;
  updatedAt: string;
  subtaskCount: number;
  commentCount: number;
  isLocked: boolean;
  watcherCount: number;
}

export interface CreateTaskInput {
  title: string;
  projectId?: string | null;
  parentTaskId?: string | null;
  status?: TaskStatus;
  priority?: Priority;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  memberIds?: string[];
  labelIds?: string[];
  reporterId?: string | null;
  team?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  isLocked?: boolean;
}

export interface TaskQueryParams {
  projectId?: string;
  status?: TaskStatus;
  q?: string;
  memberId?: string;
  labelId?: string;
  priority?: Priority;
}

export interface Comment {
  id: string;
  taskId: string;
  author: Member;
  body: string;
  attachments: string[];
  createdAt: string;
}

export interface ActivityLogEntry {
  id: string;
  taskId: string;
  actor: Member;
  type: import("./enums").ActivityType;
  fromValue: string | null;
  toValue: string | null;
  createdAt: string;
}
