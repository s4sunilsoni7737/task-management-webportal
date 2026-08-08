import { v4 as uuid } from "uuid";
import type {
  ActivityLogEntry,
  Comment,
  Label,
  Member,
  Project,
  Task,
  Workspace,
} from "../types";

/**
 * In-memory "database" backing the mock API route handlers under
 * `src/app/api/**`. This exists purely so the app is fully functional
 * without a deployed backend, per the assignment's service-layer
 * requirement ("ready for backend integration"). Swap `NEXT_PUBLIC_API_URL`
 * to a real NestJS server and none of the frontend code below this layer
 * needs to change — only these route handlers become unnecessary.
 *
 * NOTE: state resets whenever the server process restarts (serverless
 * cold start, redeploy, etc.) since it is not backed by a real database.
 */

// ---------------------------------------------------------------------------
// Members
// ---------------------------------------------------------------------------
export const members: Member[] = [
  { id: "m-dexter", name: "Dexter", email: "dexter@gmail.com", avatarUrl: null, role: "Owner" },
  { id: "m-ankit", name: "Ankit Dutta", email: "ankit@dexter.app", avatarUrl: null, role: "Developer" },
  { id: "m-priya", name: "Priya Shah", email: "priya@dexter.app", avatarUrl: null, role: "Designer" },
  { id: "m-rahul", name: "Rahul Verma", email: "rahul@dexter.app", avatarUrl: null, role: "QA" },
  { id: "m-neha", name: "Neha Kapoor", email: "neha@dexter.app", avatarUrl: null, role: "PM" },
];

export function findMember(id: string | null | undefined): Member | null {
  if (!id) return null;
  return members.find((m) => m.id === id) ?? null;
}

// ---------------------------------------------------------------------------
// Workspace
// ---------------------------------------------------------------------------
export const workspace: Workspace = {
  id: "ws-dexter",
  name: "Dexter",
  avatarUrl: null,
  ownerId: "m-dexter",
  memberIds: members.map((m) => m.id),
};

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------
export const labels: Label[] = [
  { id: "l-research", workspaceId: workspace.id, name: "Research", color: "#A8B0C0" },
  { id: "l-design", workspaceId: workspace.id, name: "Design", color: "#6D5DF5" },
  { id: "l-development", workspaceId: workspace.id, name: "Development", color: "#0F9F6E" },
  { id: "l-testing", workspaceId: workspace.id, name: "Testing", color: "#F59E0B" },
  { id: "l-deployment", workspaceId: workspace.id, name: "Deployment", color: "#F04444" },
];

export function findLabels(ids: string[]): Label[] {
  return labels.filter((l) => ids.includes(l.id));
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------
export const projects: Project[] = [
  {
    id: "p-homepage",
    workspaceId: workspace.id,
    name: "Design Homepage",
    priority: "high",
    lead: findMember("m-priya"),
    dueDate: "2026-09-12",
    createdAt: "2026-07-01T09:00:00.000Z",
    taskCount: 0,
  },
  {
    id: "p-login",
    workspaceId: workspace.id,
    name: "Develop Login Feature",
    priority: "low",
    lead: findMember("m-ankit"),
    dueDate: "2026-09-15",
    createdAt: "2026-07-03T09:00:00.000Z",
    taskCount: 0,
  },
  {
    id: "p-payment",
    workspaceId: workspace.id,
    name: "Test Payment Gateway",
    priority: "medium",
    lead: null,
    dueDate: "2026-09-18",
    createdAt: "2026-07-05T09:00:00.000Z",
    taskCount: 0,
  },
];

export function findProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

// ---------------------------------------------------------------------------
// Tasks
// ---------------------------------------------------------------------------
function makeTask(partial: Partial<Task> & Pick<Task, "id" | "title" | "status">): Task {
  const now = new Date().toISOString();
  return {
    projectId: null,
    parentTaskId: null,
    description: "",
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
    ...partial,
  };
}

export const tasks: Task[] = [
  makeTask({
    id: "t-api-docs",
    title: "Write API Documentation",
    description:
      "Create clear and detailed API documentation to guide developers in using the inventory and sales metrics features effectively.",
    status: "todo",
    priority: "urgent",
    projectId: "p-homepage",
    members: [findMember("m-priya")!],
    labels: findLabels(["l-research", "l-design", "l-development", "l-testing", "l-deployment"]),
    reporter: findMember("m-dexter"),
    team: "Platform",
    startDate: "2026-01-05",
    endDate: "2026-01-31",
    subtaskCount: 3,
    commentCount: 1,
    watcherCount: 1,
  }),
  makeTask({
    id: "t-wireframes",
    title: "Create wireframes for homepage",
    status: "todo",
    priority: "high",
    projectId: "p-homepage",
    members: [findMember("m-priya")!],
    endDate: "2026-09-12",
  }),
  makeTask({
    id: "t-user-flow",
    title: "Map out primary user flows",
    status: "todo",
    priority: "medium",
    projectId: "p-homepage",
    endDate: "2026-09-14",
  }),
  makeTask({
    id: "t-visual-design",
    title: "Design visual system & components",
    status: "doing",
    priority: "high",
    projectId: "p-homepage",
    members: [findMember("m-priya")!, findMember("m-neha")!],
    endDate: "2026-09-20",
  }),
  makeTask({
    id: "t-dev-handoff",
    title: "Prepare developer handoff assets",
    status: "doing",
    priority: "medium",
    projectId: "p-homepage",
    endDate: "2026-09-22",
  }),
  makeTask({
    id: "t-brief",
    title: "Draft creative brief",
    status: "completed",
    priority: "low",
    projectId: "p-homepage",
    members: [findMember("m-dexter")!],
    endDate: "2026-08-28",
  }),
  makeTask({
    id: "t-stakeholder-review",
    title: "Stakeholder review session",
    status: "completed",
    priority: "medium",
    projectId: "p-homepage",
    endDate: "2026-08-30",
  }),
  // Standalone tasks (not tied to a project) for the top-level Tasks view
  makeTask({
    id: "t-standalone-1",
    title: "Set up analytics dashboard",
    status: "todo",
    priority: "medium",
    members: [findMember("m-rahul")!],
    endDate: "2026-09-10",
  }),
  makeTask({
    id: "t-standalone-2",
    title: "Fix login redirect bug",
    status: "doing",
    priority: "high",
    members: [findMember("m-ankit")!],
    endDate: "2026-09-08",
  }),
  makeTask({
    id: "t-standalone-3",
    title: "Weekly team sync notes",
    status: "on_hold",
    priority: "low",
    endDate: "2026-09-05",
  }),
  makeTask({
    id: "t-standalone-4",
    title: "Renew SSL certificate",
    status: "completed",
    priority: "low",
    members: [findMember("m-ankit")!],
    endDate: "2026-08-15",
  }),
];

// ---------------------------------------------------------------------------
// Subtasks of "Write API Documentation" (t-api-docs)
// ---------------------------------------------------------------------------
export const subtasks: Task[] = [
  makeTask({
    id: "st-1",
    title: "Outline documentation sections",
    status: "todo",
    priority: "high",
    parentTaskId: "t-api-docs",
    members: [findMember("m-priya")!],
    endDate: "2026-09-12",
  }),
  makeTask({
    id: "st-2",
    title: "Document authentication endpoints",
    status: "todo",
    priority: "low",
    parentTaskId: "t-api-docs",
    members: [findMember("m-ankit")!],
    endDate: "2026-09-15",
  }),
  makeTask({
    id: "st-3",
    title: "Review with backend team",
    status: "todo",
    priority: "medium",
    parentTaskId: "t-api-docs",
    endDate: "2026-09-18",
  }),
];

export function getAllTasksIncludingSubtasks(): Task[] {
  return [...tasks, ...subtasks];
}

export function findTask(id: string): Task | undefined {
  return getAllTasksIncludingSubtasks().find((t) => t.id === id);
}

export function getSubtasksOf(parentId: string): Task[] {
  return subtasks.filter((t) => t.parentTaskId === parentId);
}

// ---------------------------------------------------------------------------
// Comments
// ---------------------------------------------------------------------------
export const comments: Comment[] = [
  {
    id: "c-1",
    taskId: "t-api-docs",
    author: findMember("m-ankit")!,
    body: "dsds",
    attachments: [],
    createdAt: new Date(Date.now() - 60_000).toISOString(),
  },
];

export function getCommentsOf(taskId: string): Comment[] {
  return comments.filter((c) => c.taskId === taskId);
}

// ---------------------------------------------------------------------------
// Activity log
// ---------------------------------------------------------------------------
export const activityLog: ActivityLogEntry[] = [
  {
    id: "a-1",
    taskId: "t-api-docs",
    actor: findMember("m-dexter")!,
    type: "priority_change",
    fromValue: "No priority",
    toValue: "Urgent",
    createdAt: "2026-08-01T10:00:00.000Z",
  },
  {
    id: "a-2",
    taskId: "t-api-docs",
    actor: findMember("m-dexter")!,
    type: "comment",
    fromValue: null,
    toValue: null,
    createdAt: "2026-08-02T09:30:00.000Z",
  },
];

export function getActivityOf(taskId: string): ActivityLogEntry[] {
  return activityLog
    .filter((a) => a.taskId === taskId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function pushActivity(entry: Omit<ActivityLogEntry, "id">): ActivityLogEntry {
  const full: ActivityLogEntry = { ...entry, id: uuid() };
  activityLog.push(full);
  return full;
}

// Keep project.taskCount in sync at module init.
projects.forEach((p) => {
  p.taskCount = tasks.filter((t) => t.projectId === p.id).length;
});
