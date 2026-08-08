import type { AxiosRequestConfig } from "axios";
import "./api-interceptors"; // registers interceptors as a side effect on first import
import { apiClient } from "./api-client";
import { normalizeApiError } from "./api-error-handler";
import { unwrapEnvelope, type ApiEnvelope } from "./api-response";

export type RequestConfig = AxiosRequestConfig;

/**
 * The ONLY function that should ever be used to talk to the API.
 * - Unwraps the `{ data: T }` envelope.
 * - Normalizes 204 No Content to `undefined`.
 * - Converts any failure into a typed `ApiError`.
 *
 * Domain services (e.g. `tasksService.getAll()`) call this; components
 * never call `apiClient` or `axios` directly.
 */
export async function request<TResponse>(config: RequestConfig): Promise<TResponse> {
  try {
    const response = await apiClient.request<ApiEnvelope<TResponse> | TResponse>(config);

    if (response.status === 204) {
      return undefined as TResponse;
    }

    return unwrapEnvelope<TResponse>(response.data);
  } catch (error) {
    throw normalizeApiError(error);
  }
}
