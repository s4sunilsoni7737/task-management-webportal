import { request } from "@/services/api/api-handler";
import { API_ENDPOINTS } from "@/services/api/endpoints";
import type { Member } from "@/lib/types";

export const membersService = {
  getAll(): Promise<Member[]> {
    return request<Member[]>({ url: API_ENDPOINTS.MEMBERS.ROOT, method: "GET" });
  },
};
