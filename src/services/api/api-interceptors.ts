import type { InternalAxiosRequestConfig } from "axios";
import { apiClient } from "./api-client";
import { getAccessTokenSnapshot, useAuthStore } from "../../store/authStore";

/**
 * Request interceptor — injects the Bearer token (guest session token or
 * a future OAuth-issued token) on every outgoing request.
 */
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessTokenSnapshot();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

/**
 * Response interceptor — scaffold for 401 handling.
 *
 * TODO(auth): once a real backend issues short-lived access tokens with a
 * refresh-token flow, implement the standard pattern here:
 *   1. On 401, pause the failing request.
 *   2. Call POST /auth/refresh once (dedupe concurrent 401s into a single
 *      refresh call via a shared in-flight promise).
 *   3. Retry the original request with the new token.
 *   4. If refresh fails, call useAuthStore.getState().clear() and redirect
 *      to /login.
 *
 * The current app only issues long-lived guest sessions, so there is no
 * refresh flow yet — this interceptor simply clears auth state on 401 so
 * the UI can redirect to /login.
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      useAuthStore.getState().clear();
    }
    return Promise.reject(error);
  },
);
