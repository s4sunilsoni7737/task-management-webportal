import { request } from "../api/api-handler";
import { API_ENDPOINTS } from "../api/endpoints";
import type {
  ActivityLogEntry,
  Comment,
  CreateTaskInput,
  Task,
  TaskQueryParams,
  UpdateTaskInput,
} from "../../lib/types";

function buildQuery(params: TaskQueryParams = {}): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  });
  const qs = query.toString();
  return qs ? `?${qs}` : "";
}

export const tasksService = {
  getAll(params?: TaskQueryParams): Promise<Task[]> {
    return request<Task[]>({
      url: `${API_ENDPOINTS.TASKS.ROOT}${buildQuery(params)}`,
      method: "GET",
    });
  },

  getById(id: string): Promise<Task> {
    return request<Task>({ url: API_ENDPOINTS.TASKS.DETAIL(id), method: "GET" });
  },

  create(input: CreateTaskInput): Promise<Task> {
    return request<Task>({ url: API_ENDPOINTS.TASKS.ROOT, method: "POST", data: input });
  },

  addResource(id: string, input: { name: string; url: string }): Promise<Task> {
    return request<Task>({ url: API_ENDPOINTS.TASKS.RESOURCES(id), method: "POST", data: input });
  },

  watch(id: string): Promise<void> {
    return request<void>({ url: API_ENDPOINTS.TASKS.WATCH(id), method: "POST" });
  },

  unwatch(id: string): Promise<void> {
    return request<void>({ url: API_ENDPOINTS.TASKS.WATCH(id), method: "DELETE" });
  },

  update(id: string, input: UpdateTaskInput): Promise<Task> {
    return request<Task>({ url: API_ENDPOINTS.TASKS.DETAIL(id), method: "PATCH", data: input });
  },

  remove(id: string): Promise<void> {
    return request<void>({ url: API_ENDPOINTS.TASKS.DETAIL(id), method: "DELETE" });
  },

  getSubtasks(id: string): Promise<Task[]> {
    return request<Task[]>({ url: API_ENDPOINTS.TASKS.SUBTASKS(id), method: "GET" });
  },

  addSubtask(id: string, title: string): Promise<Task> {
    return request<Task>({
      url: API_ENDPOINTS.TASKS.SUBTASKS(id),
      method: "POST",
      data: { title },
    });
  },

  getComments(id: string): Promise<Comment[]> {
    return request<Comment[]>({ url: API_ENDPOINTS.TASKS.COMMENTS(id), method: "GET" });
  },

  addComment(id: string, body: string): Promise<Comment> {
    return request<Comment>({
      url: API_ENDPOINTS.TASKS.COMMENTS(id),
      method: "POST",
      data: { body },
    });
  },

  updateComment(id: string, commentId: string, body: string): Promise<Comment> {
    return request<Comment>({
      url: API_ENDPOINTS.TASKS.COMMENT_DETAIL(id, commentId),
      method: "PATCH",
      data: { body },
    });
  },

  removeComment(id: string, commentId: string): Promise<void> {
    return request<void>({
      url: API_ENDPOINTS.TASKS.COMMENT_DETAIL(id, commentId),
      method: "DELETE",
    });
  },

  getActivity(id: string): Promise<ActivityLogEntry[]> {
    return request<ActivityLogEntry[]>({ url: API_ENDPOINTS.TASKS.ACTIVITY(id), method: "GET" });
  },
};
