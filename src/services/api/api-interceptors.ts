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

// Flag to track if a refresh is currently in progress
let isRefreshing = false;
// Queue to hold pending requests while a refresh is occurring
let refreshSubscribers: ((token: string) => void)[] = [];

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

/**
 * Response interceptor — 401 handling with Refresh Queue pattern.
 *
 * If a short-lived access-token + refresh flow is fully added later, the
 * backend call inside the `isRefreshing` block can be replaced with the actual
 * refresh endpoint. For now, since it's a long-lived JWT, a 401 just clears the
 * session and bounces to /login.
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        
        try {
          // Placeholder for actual refresh logic when implemented.
          // const newToken = await authService.refreshToken();
          // onRefreshed(newToken);
          
          // Since we don't have a refresh endpoint yet, we just fail it:
          throw new Error("No refresh token endpoint configured");
        } catch (refreshError) {
          useAuthStore.getState().clear();
          refreshSubscribers = [];
          if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
            window.location.replace("/login");
          }
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // If a refresh is already in progress, wait for it to complete
      return new Promise((resolve) => {
        addRefreshSubscriber((token: string) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(apiClient(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  },
);
