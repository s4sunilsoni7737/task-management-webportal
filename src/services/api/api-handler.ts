import type { AxiosRequestConfig } from "axios";
import "./api-interceptors"; // registers interceptors as a side effect on first import
import { apiClient } from "./api-client";
import { normalizeApiError } from "./api-error-handler";
import { unwrapEnvelope, type ApiEnvelope } from "./api-response";

export type RequestConfig = AxiosRequestConfig;

/**
 * Recursively transform a raw backend payload into the shape the frontend
 * expects:
 *  - `_id` → `id`  (and ObjectId → string)
 *  - Recursively applied to nested objects and arrays.
 *
 * The backend stores data in MongoDB, so Mongoose documents carry `_id`
 * rather than the `id` string the UI uses everywhere. Doing this once at
 * the edge keeps every domain service and component unaware of the
 * persistence shape.
 */
function transformId<T>(payload: T): T {
  if (!payload || typeof payload !== "object") return payload;

  if (Array.isArray(payload)) {
    return payload.map((item) => transformId(item)) as unknown as T;
  }

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload as Record<string, unknown>)) {
    if (key === "_id") {
      result.id = typeof value === "object" && value !== null && "toString" in value
        ? value.toString()
        : String(value);
    } else {
      result[key] =
        value && typeof value === "object" && !(value instanceof Date) && !Buffer.isBuffer(value)
          ? transformId(value)
          : value;
    }
  }
  return result as T;
}

/**
 * The ONLY function that should ever be used to talk to the API.
 * - Unwraps the `{ data }` envelope from the standardized response shape.
 * - Normalizes 204 No Content to `undefined`.
 * - Transforms `_id` → `id` (and ObjectId → string) recursively.
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

    const unwrapped = unwrapEnvelope<TResponse>(response.data);
    return transformId<TResponse>(unwrapped);
  } catch (error) {
    throw normalizeApiError(error);
  }
}
