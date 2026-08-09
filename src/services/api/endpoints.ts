/**
 * Every backend route the app talks to, in one place. Domain services
 * import from here instead of hand-writing URL strings.
 *
 * NOTE: The backend uses a global prefix `/api` and URI versioning `/v1`,
 * so the base URL is `http://localhost:8000/api/v1` (see constants.ts).
 * These endpoint paths are relative to that base.
 */

export type ApiId = string | number;

export const API_ENDPOINTS = {
  AUTH: {
    GUEST: "/auth/guest",
    GOOGLE: "/auth/google",
    GOOGLE_CALLBACK: "/auth/google/callback",
  },
  USERS: {
    ME: "/users/me",
    PROFILE: "/users/me/profile",
    PREFERENCES: "/users/me/preferences",
  },
  WORKSPACES: {
    ROOT: "/workspaces",
    DETAIL: (id: string) => `/workspaces/${id}`,
    MEMBERS: (id: string) => `/workspaces/${id}/members`,
  },
  PROJECTS: {
    ROOT: "/projects",
    DETAIL: (id: string) => `/projects/${id}`,
  },
  TASKS: {
    ROOT: "/tasks",
    DETAIL: (id: string) => `/tasks/${id}`,
    RESOURCES: (id: string) => `/tasks/${id}/resources`,
    WATCH: (id: string) => `/tasks/${id}/watch`,
    SUBTASKS: (id: string) => `/tasks/${id}/subtasks`,
    COMMENTS: (id: string) => `/tasks/${id}/comments`,
    COMMENT_DETAIL: (id: string, commentId: string) => `/tasks/${id}/comments/${commentId}`,
    ACTIVITY: (id: string) => `/tasks/${id}/activity`,
  },
  LABELS: {
    ROOT: "/labels",
    DETAIL: (id: string) => `/labels/${id}`,
  },
  MEMBERS: {
    ROOT: "/members",
  },
} as const;