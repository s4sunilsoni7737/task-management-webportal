"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { usersService } from "../../services/users/users.service";
import { GlobalLoader } from "./global-loader";

/**
 * Waits for the persisted auth store to rehydrate from localStorage before
 * rendering the app, so route guards (e.g. "redirect to /login if no
 * session") never fire on a false-empty state during the first render.
 *
 * After hydration, if a token exists, validates it against GET /users/me
 * and refreshes the cached user (server-side preferences). On failure,
 * clears the stale session so the user is redirected to /login.
 */
export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const hydrated = useAuthStore((state) => state.hydrated);
  const accessToken = useAuthStore((state) => state.accessToken);
  const updateUser = useAuthStore((state) => state.updateUser);
  const clear = useAuthStore((state) => state.clear);
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    if (!hydrated || !accessToken || validating) return;
    setValidating(true);
    usersService
      .getMe()
      .then((user) => {
        updateUser(user);
      })
      .catch(() => {
        clear();
      })
      .finally(() => setValidating(false));
  }, [hydrated, accessToken, validating, updateUser, clear]);

  if (!hydrated) {
    return (
      <div className="fixed inset-0">
        <GlobalLoader />
      </div>
    );
  }

  return <>{children}</>;
}