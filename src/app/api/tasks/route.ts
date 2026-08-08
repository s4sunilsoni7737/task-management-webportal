import { v4 as uuid } from "uuid";
import { jsonOk, mockDelay } from "../../../lib/mock/respond";
import { findMember, findProject, pushActivity, tasks } from "../../../lib/mock/db";
import type { CreateTaskInput, Task } from "../../../lib/types";

/**
 * GET /api/tasks?projectId=&status=&q=&memberId=&labelId=&priority=
 * Mirrors NestJS `GET /tasks?status=&projectId=&q=` from the Scope of Work.
 * Only returns top-level tasks (parentTaskId === null) — subtasks are
 * fetched via /api/tasks/[id]/subtasks.
 */
export async function GET(request: Request) {
  await mockDelay();
  const { searchParams } = new URL(request.url);

  const projectId = searchParams.get("projectId");
  const status = searchParams.get("status");
  const q = searchParams.get("q")?.toLowerCase().trim();
  const memberId = searchParams.get("memberId");
  const labelId = searchParams.get("labelId");
  const priority = searchParams.get("priority");

  let result = tasks.filter((t) => t.parentTaskId === null);

  if (projectId) result = result.filter((t) => t.projectId === projectId);
  if (status) result = result.filter((t) => t.status === status);
  if (priority) result = result.filter((t) => t.priority === priority);
  if (memberId) result = result.filter((t) => t.members.some((m) => m.id === memberId));
  if (labelId) result = result.filter((t) => t.labels.some((l) => l.id === labelId));
  if (q) result = result.filter((t) => t.title.toLowerCase().includes(q));

  return jsonOk(result);
}

/**
 * POST /api/tasks
 * Creates a task with a default status of "todo" per the Process Flow
 * ("entering a name creates the task with a default status (To Do)").
 */
export async function POST(request: Request) {
  await mockDelay();
  const body = (await request.json()) as CreateTaskInput;

  if (!body.title || !body.title.trim()) {
    return jsonOk({ message: "Title is required" }, 400);
  }

  const now = new Date().toISOString();
  const project = body.projectId ? findProject(body.projectId) : undefined;

  const task: Task = {
    id: uuid(),
    projectId: body.projectId ?? null,
    parentTaskId: body.parentTaskId ?? null,
    title: body.title.trim(),
    description: "",
    status: body.status ?? "todo",
    priority: body.priority ?? "no_priority",
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

  tasks.push(task);
  if (project) project.taskCount += 1;

  pushActivity({
    taskId: task.id,
    actor: findMember("m-dexter")!,
    type: "created",
    fromValue: null,
    toValue: task.title,
    createdAt: now,
  });

  return jsonOk(task, 201);
}
