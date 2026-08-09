import { request } from "../api/api-handler";
import { API_ENDPOINTS } from "../api/endpoints";
import { toPaginatedResponse, type PaginatedResponse } from "../api/api-response";
import { normalizeProject, normalizeProjectList } from "../../lib/utils/normalize";
import type { CreateProjectInput, Project, ProjectQueryParams, UpdateProjectInput } from "../../lib/types";

interface RawProjectListResponse {
  list: unknown[];
  total: number;
  page: number;
  limit: number;
}

export const projectsService = {
  /** Server-driven paginated project list (`search`, `page`, `limit`, `sortBy`, `sortOrder`). */
  async getAll(params: ProjectQueryParams = {}): Promise<PaginatedResponse<Project>> {
    const res = await request<RawProjectListResponse>({
      url: API_ENDPOINTS.PROJECTS.ROOT,
      method: "GET",
      params: {
        page: 1,
        limit: 10,
        ...params,
      },
    });
    const page = toPaginatedResponse<unknown>(res);
    return { ...page, items: normalizeProjectList(page.items) };
  },

  getById(id: string): Promise<Project> {
    return request<Project>({ url: API_ENDPOINTS.PROJECTS.DETAIL(id), method: "GET" }).then(normalizeProject);
  },

  create(input: CreateProjectInput): Promise<Project> {
    return request<Project>({ url: API_ENDPOINTS.PROJECTS.ROOT, method: "POST", body: input }).then(normalizeProject);
  },

  update(id: string, input: UpdateProjectInput): Promise<Project> {
    return request<Project>({
      url: API_ENDPOINTS.PROJECTS.DETAIL(id),
      method: "PATCH",
      body: input,
    }).then(normalizeProject);
  },

  remove(id: string): Promise<void> {
    return request<void>({ url: API_ENDPOINTS.PROJECTS.DETAIL(id), method: "DELETE" });
  },
};
