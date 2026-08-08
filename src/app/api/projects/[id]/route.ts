import { jsonError, jsonOk, mockDelay } from "../../../../lib/mock/respond";
import { findMember, findProject, projects } from "../../../../lib/mock/db";
import type { UpdateProjectInput } from "../../../../lib/types";

interface Params {
  params: { id: string };
}

export async function GET(_request: Request, { params }: Params) {
  await mockDelay();
  const project = findProject(params.id);
  if (!project) return jsonError("Project not found", 404);
  return jsonOk(project);
}

export async function PATCH(request: Request, { params }: Params) {
  await mockDelay();
  const project = findProject(params.id);
  if (!project) return jsonError("Project not found", 404);

  const body = (await request.json()) as UpdateProjectInput;
  if (body.name !== undefined) project.name = body.name;
  if (body.priority !== undefined) project.priority = body.priority;
  if (body.dueDate !== undefined) project.dueDate = body.dueDate;
  if (body.leadId !== undefined) project.lead = findMember(body.leadId);

  return jsonOk(project);
}

export async function DELETE(_request: Request, { params }: Params) {
  await mockDelay();
  const index = projects.findIndex((p) => p.id === params.id);
  if (index === -1) return jsonError("Project not found", 404);
  projects.splice(index, 1);
  return jsonOk({ success: true });
}
