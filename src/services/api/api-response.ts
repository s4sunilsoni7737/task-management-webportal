/**
 * All successful responses from the backend (mock or real) are expected
 * to be wrapped in this envelope: { data: T }. `request()` in
 * `api-handler.ts` unwraps this automatically so services and components
 * only ever deal with the plain payload type T.
 */
export interface ApiEnvelope<T> {
  data: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export function unwrapEnvelope<T>(payload: ApiEnvelope<T> | T): T {
  if (payload && typeof payload === "object" && "data" in (payload as object)) {
    return (payload as ApiEnvelope<T>).data;
  }
  return payload as T;
}
