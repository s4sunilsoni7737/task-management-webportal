import type { ProjectPriority } from "./enums";
import type { Member } from "./user";

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  priority: ProjectPriority;
  lead: Member | null;
  dueDate: string | null; // ISO date
  createdAt: string;
  taskCount: number;
}

export interface CreateProjectInput {
  name: string;
  priority: ProjectPriority;
  leadId?: string | null;
  dueDate?: string | null;
}

export type UpdateProjectInput = Partial<CreateProjectInput>;
