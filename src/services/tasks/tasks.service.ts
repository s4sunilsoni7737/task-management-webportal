import { request } from "@/services/api/api-handler";
import { API_ENDPOINTS } from "@/services/api/endpoints";
import { toPaginatedResponse, type GroupedResponse, type PaginatedResponse } from "@/services/api/api-response";
import {
  normalizeActivityLogEntry,
  normalizeComment,
  normalizeTask,
  normalizeTaskList,
} from "@/lib/utils/normalize";
import type {
  ActivityLogEntry,
  Comment,
  CreateTaskInput,
  GroupedTasks,
  Task,
  TaskQueryParams,
  UpdateTaskInput,
} from "@/lib/types";

interface RawTaskListResponse {
  list: unknown[];
  total: number;
  page: number;
  limit: number;
}

export const tasksService = {
  /**
   * Server-driven paginated task list. Every search/filter/sort is sent to
   * the backend (`q`, `status`, `priority`, `memberId`, `labelId`, `page`,
   * `limit`, `sortBy`, `sortOrder`) — no client-side filtering.
   */
  async getAll(params: TaskQueryParams = {}): Promise<PaginatedResponse<Task>> {
    const res = await request<RawTaskListResponse>({
      url: API_ENDPOINTS.TASKS.ROOT,
      method: "GET",
      params: {
        page: 1,
        limit: 10,
        topLevelOnly: true,
        ...params,
      },
    });
    const page = toPaginatedResponse<unknown>(res);
    return { ...page, items: normalizeTaskList(page.items) };
  },

  /**
   * Tasks grouped by Status in a single request (`groupByStatus=true`) —
   * the backbone of the List view's collapsible sections and the Board
   * view's Kanban columns. Search/filters are still server-side.
   */
  async getGrouped(params: Omit<TaskQueryParams, "page" | "limit"> = {}): Promise<GroupedTasks> {
    const res = await request<GroupedResponse<unknown>>({
      url: API_ENDPOINTS.TASKS.ROOT,
      method: "GET",
      params: {
        topLevelOnly: true,
        groupByStatus: true,
        ...params,
      },
    });

    const grouped: GroupedTasks["grouped"] = {};
    for (const status of Object.keys(res.grouped ?? {})) {
      const list = res.grouped[status] ?? [];
      grouped[status as keyof GroupedTasks["grouped"]] = normalizeTaskList(list);
    }

    return { grouped, total: res.total ?? 0 };
  },

  getById(id: string): Promise<Task> {
    return request<Task>({ url: API_ENDPOINTS.TASKS.DETAIL(id), method: "GET" }).then(normalizeTask);
  },

  create(input: CreateTaskInput): Promise<Task> {
    return request<Task>({ url: API_ENDPOINTS.TASKS.ROOT, method: "POST", body: input }).then(normalizeTask);
  },

  addResource(id: string, input: { name: string; file: File }): Promise<Task> {
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("url", input.file); // Backend controller reads 'url' as the file field

    return request<Task>({
      url: API_ENDPOINTS.TASKS.RESOURCES(id),
      method: "POST",
      body: formData,
    }).then(normalizeTask);
  },

  removeResource(id: string, resourceId: string): Promise<void> {
    return request<void>({
      url: `${API_ENDPOINTS.TASKS.RESOURCES(id)}/${resourceId}`,
      method: "DELETE",
    });
  },

  watch(id: string): Promise<void> {
    return request<void>({ url: API_ENDPOINTS.TASKS.WATCH(id), method: "POST" });
  },

  unwatch(id: string): Promise<void> {
    return request<void>({ url: API_ENDPOINTS.TASKS.WATCH(id), method: "DELETE" });
  },

  update(id: string, input: UpdateTaskInput): Promise<Task> {
    return request<Task>({ url: API_ENDPOINTS.TASKS.DETAIL(id), method: "PATCH", body: input }).then(normalizeTask);
  },

  remove(id: string): Promise<void> {
    return request<void>({ url: API_ENDPOINTS.TASKS.DETAIL(id), method: "DELETE" });
  },

  getSubtasks(id: string): Promise<Task[]> {
    return request<unknown[]>({ url: API_ENDPOINTS.TASKS.SUBTASKS(id), method: "GET" }).then(normalizeTaskList);
  },

  addSubtask(
    id: string,
    input: { title: string; memberIds?: string[]; dueDate?: string | null },
  ): Promise<Task> {
    return request<Task>({
      url: API_ENDPOINTS.TASKS.SUBTASKS(id),
      method: "POST",
      body: input,
    }).then(normalizeTask);
  },

  getComments(id: string): Promise<Comment[]> {
    return request<unknown[]>({ url: API_ENDPOINTS.TASKS.COMMENTS(id), method: "GET" }).then((list) =>
      list.map(normalizeComment),
    );
  },

  addComment(id: string, input: { body: string; attachments?: { name: string; url: string }[] }): Promise<Comment> {
    return request<Comment>({
      url: API_ENDPOINTS.TASKS.COMMENTS(id),
      method: "POST",
      body: input,
    }).then(normalizeComment);
  },

  updateComment(id: string, commentId: string, body: string): Promise<Comment> {
    return request<Comment>({
      url: API_ENDPOINTS.TASKS.COMMENT_DETAIL(id, commentId),
      method: "PATCH",
      body: { body },
    }).then(normalizeComment);
  },

  removeComment(id: string, commentId: string): Promise<void> {
    return request<void>({
      url: API_ENDPOINTS.TASKS.COMMENT_DETAIL(id, commentId),
      method: "DELETE",
    });
  },

  getActivity(id: string): Promise<ActivityLogEntry[]> {
    return request<unknown[]>({ url: API_ENDPOINTS.TASKS.ACTIVITY(id), method: "GET" }).then((list) =>
      list.map(normalizeActivityLogEntry),
    );
  },
};
