import { request } from "../api/api-handler";
import { API_ENDPOINTS } from "../api/endpoints";
import type { UserPreferences } from "../../lib/types";

export const usersService = {
  updatePreferences(prefs: UserPreferences): Promise<UserPreferences> {
    return request<UserPreferences>({
      url: API_ENDPOINTS.USERS.PREFERENCES,
      method: "PATCH",
      data: prefs,
    });
  },
};
