import { v4 as uuid } from "uuid";
import { jsonError, jsonOk, mockDelay } from "../../../lib/mock/respond";
import { findMember, projects, workspace } from "../../../lib/mock/db";
import type { CreateProjectInput, Project } from "../../../lib/types";

/** GET /api/projects */
export async function GET() {
  await mockDelay();
  return jsonOk(projects);
}

/** POST /api/projects — Scope of Work: GET/POST /projects */
export async function POST(request: Request) {
  await mockDelay();
  const body = (await request.json()) as CreateProjectInput;

  if (!body.name?.trim()) return jsonError("Project name is required", 400);

  const project: Project = {
    id: uuid(),
    workspaceId: workspace.id,
    name: body.name.trim(),
    priority: body.priority ?? "medium",
    lead: body.leadId ? findMember(body.leadId) : null,
    dueDate: body.dueDate ?? null,
    createdAt: new Date().toISOString(),
    taskCount: 0,
  };

  projects.push(project);
  return jsonOk(project, 201);
}
