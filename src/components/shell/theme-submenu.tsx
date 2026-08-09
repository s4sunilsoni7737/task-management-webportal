"use client";

import { Moon, Sun } from "lucide-react";
import { Popover } from "../ui/popover";
import { MenuItem } from "../ui/menu-item";
import { useUiStore } from "../../store/uiStore";
import { usersService } from "../../services/users/users.service";
import { toast } from "../../store/toastStore";
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

/** Light/Dark submenu opened from the "Change Theme" row in WorkspaceMenu. */
export function ThemeSubmenu({ open, onClose, anchorRef }: ThemeSubmenuProps) {
  const theme = useUiStore((s) => s.theme);
  const setTheme = useUiStore((s) => s.setTheme);
  const colorMode = useUiStore((s) => s.colorMode);

  function handleSelect(value: ThemeMode) {
    setTheme(value);
    // Persist to backend so the choice survives across sessions (guest or OAuth).
    usersService.updatePreferences({ theme: value, colorMode }).catch(() => {
      toast.error("Couldn't save theme preference");
    });
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
