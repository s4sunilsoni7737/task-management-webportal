import { useQuery } from "@tanstack/react-query";
import { usersService } from "../services/users/users.service";
import { useApiMutation } from "./useApiMutation";
import { useAuthStore } from "../store/authStore";
import { useUiStore } from "../store/uiStore";
import type { UserPreferences } from "../lib/types";

/** User profile query — refreshed whenever theme/colorMode change so the store stays server-true. */
export function useMe(enabled = true) {
  return useQuery({
    queryKey: ["users", "me"],
    queryFn: () => usersService.getMe(),
    enabled,
  });
}

/**
 * Theme/Color Mode are AUTHORITATIVE ON THE BACKEND (user preferences).
 * The store is optimistically updated + applied to the DOM on select; the
 * server write goes through this mutation which invalidates `["users", "me"]`.
 */
export function useUpdatePreferences() {
  const updateUser = useAuthStore((s) => s.updateUser);
  const setTheme = useUiStore((s) => s.setTheme);
  const setColorMode = useUiStore((s) => s.setColorMode);

  return useApiMutation({
    mutationFn: (prefs: UserPreferences) => usersService.updatePreferences(prefs),
    successMessage: "Preferences saved",
    errorMessage: "Couldn't save preferences",
    invalidateQueries: [["users", "me"]],
    onSuccess: (user) => {
      if (user.preferences) {
        setTheme(user.preferences.theme);
        setColorMode(user.preferences.colorMode);
        updateUser(user);
      }
    },
  });
}