import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ColorMode, ThemeMode } from "../lib/types";

interface UiState {
  theme: ThemeMode;
  colorMode: ColorMode;
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  taskView: "list" | "board";
  setTheme: (theme: ThemeMode) => void;
  setColorMode: (colorMode: ColorMode) => void;
  toggleSidebar: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
  setTaskView: (view: "list" | "board") => void;
}

/**
 * Client-only UI state: theme, accent color mode, sidebar collapse, and
 * the Tasks List/Board toggle. Persisted to localStorage so the
 * assessment's "theme must persist across refresh" requirement holds for
 * guest sessions. See `src/app/layout.tsx` for the inline script that
 * applies this before first paint (avoids flash-of-wrong-theme).
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
