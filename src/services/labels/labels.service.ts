import { request } from "../api/api-handler";
import { API_ENDPOINTS } from "../api/endpoints";
import type { Label } from "../../lib/types";

export const labelsService = {
  getAll(): Promise<Label[]> {
    return request<Label[]>({ url: API_ENDPOINTS.LABELS.ROOT, method: "GET" });
  },
};
