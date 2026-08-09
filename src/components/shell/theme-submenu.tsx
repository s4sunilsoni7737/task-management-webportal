"use client";

import { Moon, Sun } from "lucide-react";
import { Popover } from "../ui/popover";
import { MenuItem } from "../ui/menu-item";
import { useUiStore } from "../../store/uiStore";
import { useUpdatePreferences } from "../../hooks/useUsers";
import { useAuthStore } from "../../store/authStore";
import type { ThemeMode } from "../../lib/types";

const OPTIONS: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
];

interface ThemeSubmenuProps {
  open: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement>;
}

/**
 * Light/Dark submenu opened from the "Change Theme" row in WorkspaceMenu.
 * Theme is owner by the BACKEND (`user.preferences.theme`): we optimistically
 * apply it via the uiStore, then persist through `useUpdatePreferences`.
 */
export function ThemeSubmenu({ open, onClose, anchorRef }: ThemeSubmenuProps) {
  const theme = useUiStore((s) => s.theme);
  const colorMode = useUiStore((s) => s.colorMode);
  const setTheme = useUiStore((s) => s.setTheme);
  const updatePreferences = useUpdatePreferences();
  const user = useAuthStore((s) => s.user);

  function handleSelect(value: ThemeMode) {
    setTheme(value); // optimistic DOM + store update
    onClose();
    // Persist to the backend — it is the source of truth for this preference.
    updatePreferences.mutate({ theme: value, colorMode: colorMode || user?.preferences?.colorMode || "blue" });
  }

  return (
    <Popover
      open={open}
      onClose={onClose}
      anchorRef={anchorRef}
      side="right"
      align="start"
      offset={4}
      className="w-[150px] p-1"
    >
      {OPTIONS.map((option) => (
        <MenuItem
          key={option.value}
          icon={option.icon}
          label={option.label}
          selected={theme === option.value}
          onClick={() => handleSelect(option.value)}
        />
      ))}
    </Popover>
  );
}
