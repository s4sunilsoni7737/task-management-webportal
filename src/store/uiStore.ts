import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ColorMode, ThemeMode, UserPreferences } from "@/lib/types";

interface UiState {
  theme: ThemeMode;
  colorMode: ColorMode;
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  taskView: "list" | "board";
  setTheme: (theme: ThemeMode) => void;
  setColorMode: (colorMode: ColorMode) => void;
  /** Apply a full `{ theme, colorMode }` pair (used when server prefs arrive). */
  applyPreferences: (prefs: UserPreferences) => void;
  toggleSidebar: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
  setTaskView: (view: "list" | "board") => void;
}

/**
 * Client UI state: theme, accent color mode, sidebar collapse, task view.
 *
 * THEME / COLOR MODE ARE BACKEND-AUTHORITATIVE: `user.preferences` from
 * `GET /users/me` is the source of truth (the store mirrors it + applies the
 * DOM attributes immediately). The localStorage persist is only a fast-path
 * cache so the inline script in `app/layout.tsx` can avoid a flash of the
 * wrong theme before React hydrates.
 */
export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      theme: "light",
      colorMode: "blue",
      sidebarCollapsed: false,
      mobileSidebarOpen: false,
      taskView: "list",
      setTheme: (theme) => {
        set({ theme });
        applyDocumentTheme(theme, useUiStore.getState().colorMode);
      },
      setColorMode: (colorMode) => {
        set({ colorMode });
        applyDocumentTheme(useUiStore.getState().theme, colorMode);
      },
      applyPreferences: (prefs) => {
        set({ theme: prefs.theme, colorMode: prefs.colorMode });
        applyDocumentTheme(prefs.theme, prefs.colorMode);
      },
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
      setTaskView: (taskView) => set({ taskView }),
    }),
    {
      name: "dexter-ui",
      partialize: (state) => ({
        theme: state.theme,
        colorMode: state.colorMode,
        sidebarCollapsed: state.sidebarCollapsed,
        taskView: state.taskView,
      }),
    },
  ),
);

/** Applies theme + color mode as DOM attributes so CSS variables cascade instantly. */
export function applyDocumentTheme(theme: ThemeMode, colorMode: ColorMode) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.setAttribute("data-color-mode", colorMode);
}
