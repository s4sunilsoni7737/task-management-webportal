import type { InternalAxiosRequestConfig } from "axios";
import { apiClient } from "@/services/api/api-client";
import { getAccessTokenSnapshot, useAuthStore } from "@/store/authStore";

/**
 * Request interceptor — injects the Bearer token (guest session token or
 * a Google OAuth-issued token) on every outgoing request.
 */
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessTokenSnapshot();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

/**
 * Response interceptor — 401 handling.
 *
 * The backend has no refresh-token endpoint (only guest + Google OAuth with
 * a long-lived JWT), so on 401 we clear the session and bounce to /login.
 * If a short-lived access-token + refresh flow is added later, extend this
 * with the refresh-queue pattern from the reference project:
 *   1. Pause concurrent 401 requests behind a single in-flight refresh.
 *   2. Call the refresh endpoint once, retry the original request.
 *   3. On refresh failure, clear auth and redirect to /login.
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      useAuthStore.getState().clear();
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        window.location.replace("/login");
      }
    }
    return Promise.reject(error);
  },
);
