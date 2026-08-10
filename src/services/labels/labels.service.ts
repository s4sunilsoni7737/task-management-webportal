import { request } from "@/services/api/api-handler";
import { API_ENDPOINTS } from "@/services/api/endpoints";
import type { Label } from "@/lib/types";

export const labelsService = {
  getAll(): Promise<Label[]> {
    return request<Label[]>({ url: API_ENDPOINTS.LABELS.ROOT, method: "GET" });
  },
};
