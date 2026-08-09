import { request } from "../api/api-handler";
import { API_ENDPOINTS } from "../api/endpoints";
import type { User, UserPreferences } from "../../lib/types";

export const usersService = {
  getMe(): Promise<User> {
    return request<User>({
      url: API_ENDPOINTS.USERS.ME,
      method: "GET",
    });
  },

  updateProfile(input: { name?: string; avatarUrl?: string | null }): Promise<User> {
    return request<User>({
      url: API_ENDPOINTS.USERS.PROFILE,
      method: "PATCH",
      data: input,
    });
  },

  updatePreferences(prefs: UserPreferences): Promise<UserPreferences> {
    return request<UserPreferences>({
      url: API_ENDPOINTS.USERS.PREFERENCES,
      method: "PATCH",
      data: prefs,
    });
  },
};
