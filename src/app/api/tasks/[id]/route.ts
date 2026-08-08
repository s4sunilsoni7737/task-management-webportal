import { jsonError, jsonOk, mockDelay } from "../../../../lib/mock/respond";
import {
  findLabels,
  findMember,
  findProject,
  findTask,
  members,
  pushActivity,
  subtasks,
  tasks,
} from "../../../../lib/mock/db";
import { PRIORITY_LABELS, TASK_STATUS_LABELS, type UpdateTaskInput } from "../../../../lib/types";

interface Params {
  params: { id: string };
}

export async function GET(_request: Request, { params }: Params) {
  await mockDelay();
  const task = findTask(params.id);
  if (!task) return jsonError("Task not found", 404);
  return jsonOk(task);
}

export async function PATCH(request: Request, { params }: Params) {
  await mockDelay();
  const task = findTask(params.id);
  if (!task) return jsonError("Task not found", 404);

  const body = (await request.json()) as UpdateTaskInput;
  const now = new Date().toISOString();
  const actor = findMember("m-dexter")!;

  if (body.status && body.status !== task.status) {
    pushActivity({
      taskId: task.id,
      actor,
      type: "status_change",
      fromValue: TASK_STATUS_LABELS[task.status],
      toValue: TASK_STATUS_LABELS[body.status],
      createdAt: now,
    });
    task.status = body.status;
  }

  if (body.priority && body.priority !== task.priority) {
    pushActivity({
      taskId: task.id,
      actor,
      type: "priority_change",
      fromValue: PRIORITY_LABELS[task.priority],
      toValue: PRIORITY_LABELS[body.priority],
      createdAt: now,
    });
    task.priority = body.priority;
  }

  if (body.title !== undefined) task.title = body.title;
  if (body.description !== undefined) task.description = body.description;
  if (body.team !== undefined) task.team = body.team;
  if (body.isLocked !== undefined) task.isLocked = body.isLocked;

  if (body.startDate !== undefined || body.endDate !== undefined) {
    const fromValue = task.endDate;
    if (body.startDate !== undefined) task.startDate = body.startDate;
    if (body.endDate !== undefined) task.endDate = body.endDate;
    pushActivity({
      taskId: task.id,
      actor,
      type: "date_change",
      fromValue,
      toValue: task.endDate,
      createdAt: now,
    });
  }

  if (body.memberIds) {
    task.members = body.memberIds
      .map((id) => members.find((m) => m.id === id))
      .filter((m): m is NonNullable<typeof m> => Boolean(m));
  }

  if (body.labelIds) {
    task.labels = findLabels(body.labelIds);
  }

  if (body.reporterId !== undefined) {
    task.reporter = findMember(body.reporterId);
  }

  task.updatedAt = now;

  return jsonOk(task);
}

export async function DELETE(_request: Request, { params }: Params) {
  await mockDelay();
  const index = tasks.findIndex((t) => t.id === params.id);

  if (index === -1) {
    const subIndex = subtasks.findIndex((t) => t.id === params.id);
    if (subIndex === -1) return jsonError("Task not found", 404);
    subtasks.splice(subIndex, 1);
    return jsonOk({ success: true });
  }

  const [removed] = tasks.splice(index, 1);
  if (removed?.projectId) {
    const project = findProject(removed.projectId);
    if (project) project.taskCount = Math.max(0, project.taskCount - 1);
  }

  return jsonOk({ success: true });
}

