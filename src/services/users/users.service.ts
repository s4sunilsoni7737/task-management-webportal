import { request } from "@/services/api/api-handler";
import { API_ENDPOINTS } from "@/services/api/endpoints";
import { normalizeUser } from "@/lib/utils/normalize";
import type { User, UserPreferences } from "@/lib/types";

export const usersService = {
  /**
   * `GET /users/me` returns the lean Mongo user doc with TOP-LEVEL
   * `theme`/`colorMode`; `normalizeUser()` maps those into the UI's nested
   * `preferences` shape (the auth endpoint already sends nested `preferences`,
   * so the helper accepts both).
   */
  getMe(): Promise<User> {
    return request<User>({ url: API_ENDPOINTS.USERS.ME, method: "GET" }).then(normalizeUser);
  },

  updateProfile(input: { name?: string; avatarUrl?: string | null }): Promise<User> {
    return request<User>({
      url: API_ENDPOINTS.USERS.PROFILE,
      method: "PATCH",
      body: input,
    }).then(normalizeUser);
  },

  updatePreferences(prefs: UserPreferences): Promise<User> {
    return request<User>({
      url: API_ENDPOINTS.USERS.PREFERENCES,
      method: "PATCH",
      body: prefs,
    }).then(normalizeUser);
  },
};
