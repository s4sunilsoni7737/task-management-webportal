"use client";

import { useAuthStore } from "../../store/authStore";
import { GlobalLoader } from "./global-loader";

/**
 * Waits for the persisted auth store to rehydrate from localStorage before
 * rendering the app, so route guards (e.g. "redirect to /login if no
 * session") never fire on a false-empty state during the first render.
 */
export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const hydrated = useAuthStore((state) => state.hydrated);

  if (!hydrated) {
    return (
      <div className="fixed inset-0">
        <GlobalLoader />
      </div>
    );
  }

  return <>{children}</>;
}
