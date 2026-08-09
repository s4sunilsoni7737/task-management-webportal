import { useRouter } from "next/navigation";
import { authService } from "../services/auth/auth.service";
import { useApiMutation } from "./useApiMutation";
import { useAuthStore } from "../store/authStore";
import { useUiStore, applyDocumentTheme } from "../store/uiStore";
import { routes } from "../lib/routeBuilder";

/** Encapsulates the guest-login flow: create session, hydrate stores, navigate. */
export function useGuestLogin() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const theme = useUiStore((s) => s.theme);
  const colorMode = useUiStore((s) => s.colorMode);

  return useApiMutation({
    mutationFn: () => authService.loginAsGuest(),
    errorMessage: "Couldn't start a guest session. Please try again.",
    onSuccess: (session) => {
      setSession(session.accessToken, {
        ...session.user,
        // Backend now returns nested `preferences` on the user; fall back
        // to the locally persisted uiStore values if absent.
        preferences: session.user.preferences ?? { theme, colorMode },
      });
      const prefs = session.user.preferences ?? { theme, colorMode };
      applyDocumentTheme(prefs.theme, prefs.colorMode);
      router.replace(routes.tasks());
    },
  });
}
