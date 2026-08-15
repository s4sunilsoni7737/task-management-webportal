import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/lib/types";

interface AuthState {
  accessToken: string | null;
  user: User | null;
  hydrated: boolean;
  setSession: (token: string, user: User) => void;
  updateUser: (patch: Partial<User>) => void;
  clear: () => void;
  setHydrated: () => void;
}

/**
 * Auth state lives in Zustand (not React Query) because it must be
 * readable outside React — the axios request interceptor reads the
 * current token via `getAccessTokenSnapshot()` on every request.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      hydrated: false,
      setSession: (token, user) => {
        if (typeof document !== "undefined") {
          document.cookie = "dexter-session=1; path=/; max-age=2592000"; // 30 days
        }
        set({ accessToken: token, user });
      },
      updateUser: (patch) =>
        set((state) => ({ user: state.user ? { ...state.user, ...patch } : state.user })),
      clear: () => {
        if (typeof document !== "undefined") {
          document.cookie = "dexter-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
        set({ accessToken: null, user: null });
      },
      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "dexter-auth",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);

/** Snapshot accessor for use outside React components (e.g. axios interceptors). */
export function getAccessTokenSnapshot(): string | null {
  return useAuthStore.getState().accessToken;
}
