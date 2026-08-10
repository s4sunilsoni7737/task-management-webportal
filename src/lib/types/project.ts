import type { ProjectPriority } from "@/lib/types/enums";
import type { Member } from "@/lib/types/user";

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  priority: ProjectPriority;
  lead: Member | null;
  dueDate: string | null; // ISO date
  createdAt: string;
  taskCount: number;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  workspaceId?: string;
  priority: ProjectPriority;
  leadId?: string | null;
  dueDate?: string | null;
}

export type UpdateProjectInput = Partial<CreateProjectInput>;

/** Server-side query params for `GET /projects`. */
export interface ProjectQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  workspaceId?: string;
}
