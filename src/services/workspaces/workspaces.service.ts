import { request } from "../api/api-handler";
import { API_ENDPOINTS } from "../api/endpoints";
import type { Workspace } from "../../lib/types";

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

  create(input: { name: string; avatarUrl?: string | null }): Promise<Workspace> {
    return request<Workspace>({
      url: API_ENDPOINTS.WORKSPACES.ROOT,
      method: "POST",
      body: input,
    });
  },

  update(id: string, input: { name?: string; avatarUrl?: string | null }): Promise<Workspace> {
    return request<Workspace>({
      url: API_ENDPOINTS.WORKSPACES.DETAIL(id),
      method: "PATCH",
      body: input,
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
