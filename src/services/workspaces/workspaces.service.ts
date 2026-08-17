import { request } from "@/services/api/api-handler";
import { API_ENDPOINTS } from "@/services/api/endpoints";
import type { Workspace } from "@/lib/types";

export const workspacesService = {
  getAll(): Promise<Workspace[]> {
    return request<Workspace[]>({
      url: API_ENDPOINTS.WORKSPACES.ROOT,
      method: "GET",
    });
  },

  getById(id: string): Promise<Workspace> {
    return request<Workspace>({
      url: API_ENDPOINTS.WORKSPACES.DETAIL(id),
      method: "GET",
    });
  },

  create(input: { name: string; avatarUrl?: File | string | null }): Promise<Workspace> {
    const formData = new FormData();
    formData.append("name", input.name);
    if (input.avatarUrl instanceof File) {
      formData.append("avatarUrl", input.avatarUrl);
    }

    return request<Workspace>({
      url: API_ENDPOINTS.WORKSPACES.ROOT,
      method: "POST",
      body: formData,
    });
  },

  update(id: string, input: { name?: string; avatarUrl?: File | string | null }): Promise<Workspace> {
    const formData = new FormData();
    if (input.name) formData.append("name", input.name);
    if (input.avatarUrl instanceof File) {
      formData.append("avatarUrl", input.avatarUrl);
    } else if (input.avatarUrl === null) {
      formData.append("avatarUrl", "");
    }

    return request<Workspace>({
      url: API_ENDPOINTS.WORKSPACES.DETAIL(id),
      method: "PATCH",
      body: formData,
    });
  },

  remove(id: string): Promise<void> {
    return request<void>({
      url: API_ENDPOINTS.WORKSPACES.DETAIL(id),
      method: "DELETE",
    });
  },

  addMember(id: string, memberUserId: string): Promise<Workspace> {
    return request<Workspace>({
      url: API_ENDPOINTS.WORKSPACES.MEMBERS(id),
      method: "POST",
      body: { userId: memberUserId },
    });
  },
};
