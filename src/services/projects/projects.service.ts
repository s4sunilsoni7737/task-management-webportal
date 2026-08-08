import { request } from "../api/api-handler";
import { API_ENDPOINTS } from "../api/endpoints";
import type { CreateProjectInput, Project, UpdateProjectInput } from "../../lib/types";

export const projectsService = {
  getAll(): Promise<Project[]> {
    return request<Project[]>({ url: API_ENDPOINTS.PROJECTS.ROOT, method: "GET" });
  },

  getById(id: string): Promise<Project> {
    return request<Project>({ url: API_ENDPOINTS.PROJECTS.DETAIL(id), method: "GET" });
  },

  create(input: CreateProjectInput): Promise<Project> {
    return request<Project>({ url: API_ENDPOINTS.PROJECTS.ROOT, method: "POST", data: input });
  },

  update(id: string, input: UpdateProjectInput): Promise<Project> {
    return request<Project>({
      url: API_ENDPOINTS.PROJECTS.DETAIL(id),
      method: "PATCH",
      data: input,
    });
  },

  remove(id: string): Promise<void> {
    return request<void>({ url: API_ENDPOINTS.PROJECTS.DETAIL(id), method: "DELETE" });
  },
};
