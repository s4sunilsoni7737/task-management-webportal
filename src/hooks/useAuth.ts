import { useRouter } from "next/navigation";
import { authService } from "../services/auth/auth.service";
import { useApiMutation } from "./useApiMutation";
import { useAuthStore } from "../store/authStore";
import { useUiStore } from "../store/uiStore";
import { routes } from "../lib/routeBuilder";

/**
 * Encapsulates the guest-login flow: create session, hydrate stores, navigate.
 *
 * THEME / COLOR MODE come from the BACKEND (`session.user.preferences`) —
 * they are applied optimistically here and re-confirmed by `AuthBootstrap`
 * via `GET /users/me` on every later page refresh.
 */
export function useGuestLogin() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const applyPreferences = useUiStore((s) => s.applyPreferences);
  const theme = useUiStore((s) => s.theme);
  const colorMode = useUiStore((s) => s.colorMode);

  return useApiMutation({
    mutationFn: () => authService.loginAsGuest(),
    errorMessage: "Couldn't start a guest session. Please try again.",
    onSuccess: (session) => {
      setSession(session.accessToken, {
        ...session.user,
        preferences: session.user.preferences ?? { theme, colorMode },
      });
      const prefs = session.user.preferences ?? { theme, colorMode };
      applyPreferences(prefs);
      router.replace(routes.tasks());
    },
  });
}
