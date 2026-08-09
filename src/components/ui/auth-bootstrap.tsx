"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "../../store/authStore";
import { useUiStore, applyDocumentTheme } from "../../store/uiStore";
import { usersService } from "../../services/users/users.service";
import { GlobalLoader } from "./global-loader";

/**
 * Waits for the persisted auth store to rehydrate from localStorage before
 * rendering the app, so route guards (e.g. "redirect to /login if no
 * session") never fire on a false-empty state during the first render.
 *
 * After hydration, if a token exists, validates it against GET /users/me
 * and hydrates the cached user AND the theme/colorMode — which the BACKEND
 * owns (user.preferences). On failure, clears the stale session so the
 * user is redirected to /login.
 */
export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const hydrated = useAuthStore((state) => state.hydrated);
  const accessToken = useAuthStore((state) => state.accessToken);
  const updateUser = useAuthStore((state) => state.updateUser);
  const clear = useAuthStore((state) => state.clear);
  const applyPreferences = useUiStore((state) => state.applyPreferences);
  const hasValidated = useRef(false);

  useEffect(() => {
    if (!accessToken) {
      hasValidated.current = false;
      return;
    }
    if (!hydrated || hasValidated.current) return;

    hasValidated.current = true;
    usersService
      .getMe()
      .then((user) => {
        updateUser(user);
        // Server prefs are the source of truth — apply to DOM + mirror in uiStore.
        if (user.preferences) {
          applyPreferences(user.preferences);
        } else {
          // Fall back to whatever's already applied on the <html> element.
          const root = document.documentElement;
          applyDocumentTheme(
            root.classList.contains("dark") ? "dark" : "light",
            (root.getAttribute("data-color-mode") as "blue") ?? "blue",
          );
        }
      })
      .catch(() => {
        clear();
      });
  }, [hydrated, accessToken, updateUser, clear, applyPreferences]);

  if (!hydrated) {
    return (
      <div className="fixed inset-0">
        <GlobalLoader />
      </div>
    );
  }

  return <>{children}</>;
}