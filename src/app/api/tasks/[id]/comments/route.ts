import { v4 as uuid } from "uuid";
import { jsonError, jsonOk, mockDelay } from "../../../../../lib/mock/respond";
import { comments, findMember, findTask, getCommentsOf, pushActivity } from "../../../../../lib/mock/db";
import type { Comment } from "../../../../../lib/types";

interface Params {
  params: { id: string };
}

/** GET /api/tasks/[id]/comments */
export async function GET(_request: Request, { params }: Params) {
  await mockDelay();
  return jsonOk(getCommentsOf(params.id));
}

/** POST /api/tasks/[id]/comments — Scope of Work: POST /tasks/:id/comments */
export async function POST(request: Request, { params }: Params) {
  await mockDelay();
  const task = findTask(params.id);
  if (!task) return jsonError("Task not found", 404);

  const body = (await request.json()) as { body: string; attachments?: string[] };
  if (!body.body?.trim()) return jsonError("Comment body is required", 400);

  const now = new Date().toISOString();
  const comment: Comment = {
    id: uuid(),
    taskId: task.id,
    author: findMember("m-dexter")!,
    body: body.body.trim(),
    attachments: body.attachments ?? [],
    createdAt: now,
  };

  comments.push(comment);
  task.commentCount += 1;

  pushActivity({
    taskId: task.id,
    actor: findMember("m-dexter")!,
    type: "comment",
    fromValue: null,
    toValue: null,
    createdAt: now,
  });

  return jsonOk(comment, 201);
}
