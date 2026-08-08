/**
 * Every backend route the app talks to, in one place. Domain services
 * import from here instead of hand-writing URL strings.
 */
export const API_ENDPOINTS = {
  AUTH: {
    GUEST: "/auth/guest",
    GOOGLE: "/auth/google",
    GOOGLE_CALLBACK: "/auth/google/callback",
  },
  USERS: {
    PREFERENCES: "/users/me/preferences",
  },
  TASKS: {
    ROOT: "/tasks",
    DETAIL: (id: string) => `/tasks/${id}`,
    SUBTASKS: (id: string) => `/tasks/${id}/subtasks`,
    COMMENTS: (id: string) => `/tasks/${id}/comments`,
    ACTIVITY: (id: string) => `/tasks/${id}/activity`,
  },
  PROJECTS: {
    ROOT: "/projects",
    DETAIL: (id: string) => `/projects/${id}`,
  },
  LABELS: {
    ROOT: "/labels",
  },
  MEMBERS: {
    ROOT: "/members",
  },
} as const;
