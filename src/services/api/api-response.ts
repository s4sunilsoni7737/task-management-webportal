/**
 * Standard API response envelope matching the real NestJS backend
 * (`TaskFlow` / `task-management-api`). Every controller method returns
 * this shape — the `ResponseInterceptor` adds `statusCode`/`logId` and
 * errors arrive as `{ statusCode, success: false, userMessage,
 * developerMessage, data }` with the matching HTTP status.
 */
export interface ApiEnvelope<T> {
  statusCode?: number;
  success?: boolean;
  userMessage?: string;
  developerMessage?: string;
  data: T;
  logId?: string;
}

/**
 * Page-normalized response shape that every list service returns.
 * Backend list endpoints respond with `{ list, total, page, limit }`
 * (and optionally `totalPages`); services map that raw shape into this
 * UI-friendly one via `toPaginatedResponse()`.
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Response shape for `GET /tasks?groupByStatus=true` — an object keyed by
 * TaskStatus (all statuses guaranteed present by the backend) plus a count.
 */
export interface GroupedResponse<T> {
  grouped: Record<string, T[]>;
  total: number;
}

/** Safely unwraps the envelope — returns `data` if wrapped, else the raw value. */
export function unwrapEnvelope<T>(payload: unknown): T {
  if (payload && typeof payload === "object" && "data" in (payload as object)) {
    return (payload as ApiEnvelope<T>).data;
  }
  return payload as T;
}

/**
 * Converts the backend's raw `{ list, total, page, limit }` pagination
 * payload into `PaginatedResponse<T>`, computing `totalPages` (the backend
 * currently omits it) and defensively defaulting every field.
 */
export function toPaginatedResponse<T>(raw: {
  list?: T[] | null;
  total?: number | null;
  page?: number | null;
  limit?: number | null;
}): PaginatedResponse<T> {
  const page = Math.max(1, Number(raw.page) || 1);
  const pageSize = Math.max(1, Number(raw.limit) || 10);
  const total = Math.max(0, Number(raw.total) || 0);
  return {
    items: raw.list ?? [],
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}
