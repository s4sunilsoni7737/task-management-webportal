import { v4 as uuid } from "uuid";
import { jsonError, jsonOk, mockDelay } from "../../../../../lib/mock/respond";
import { findMember, findTask, getSubtasksOf, subtasks } from "../../../../../lib/mock/db";
import type { Task } from "../../../../../lib/types";

interface Params {
  params: { id: string };
}

/** GET /api/tasks/[id]/subtasks */
export async function GET(_request: Request, { params }: Params) {
  await mockDelay();
  return jsonOk(getSubtasksOf(params.id));
}

/** POST /api/tasks/[id]/subtasks — Scope of Work: POST /tasks/:id/subtasks */
export async function POST(request: Request, { params }: Params) {
  await mockDelay();
  const parent = findTask(params.id);
  if (!parent) return jsonError("Parent task not found", 404);

  const body = (await request.json()) as { title: string };
  if (!body.title?.trim()) return jsonError("Title is required", 400);

  const now = new Date().toISOString();
  const subtask: Task = {
    id: uuid(),
    projectId: parent.projectId,
    parentTaskId: parent.id,
    title: body.title.trim(),
    description: "",
    status: "todo",
    priority: "no_priority",
    members: [],
    labels: [],
    reporter: findMember("m-dexter"),
    team: null,
    startDate: null,
    endDate: null,
    createdAt: now,
    updatedAt: now,
    subtaskCount: 0,
    commentCount: 0,
    isLocked: false,
    watcherCount: 1,
  };

  subtasks.push(subtask);
  parent.subtaskCount += 1;

  return jsonOk(subtask, 201);
}
