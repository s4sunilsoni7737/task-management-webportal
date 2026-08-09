"use client";

import { Check } from "lucide-react";
import { Popover } from "../ui/popover";
import { useUiStore } from "../../store/uiStore";
import { useUpdatePreferences } from "../../hooks/useUsers";
import { useAuthStore } from "../../store/authStore";
import { COLOR_MODES, type ColorMode } from "../../lib/types";
import { cn } from "../../lib/utils";

const SWATCHES: Record<ColorMode, string> = {
  amber: "#F59E0B",
  blue: "#6D5DF5",
  pink: "#EC4899",
  rose: "#F43F5E",
  emerald: "#0F9F6E",
  black: "#111111",
};

const LABELS: Record<ColorMode, string> = {
  amber: "Amber",
  blue: "Blue",
  pink: "Pink",
  rose: "Rose",
  emerald: "Emerald",
  black: "Black",
};

interface ColorModeSubmenuProps {
  open: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement>;
}

/**
 * Amber/Blue/Pink/Rose/Emerald/Black submenu opened from "Color Mode" row in
 * WorkspaceMenu. Color mode is owned by the BACKEND (`user.preferences.colorMode`);
 * we optimistically apply it, then persist via `useUpdatePreferences`.
 */
export function ColorModeSubmenu({ open, onClose, anchorRef }: ColorModeSubmenuProps) {
  const colorMode = useUiStore((s) => s.colorMode);
  const setColorMode = useUiStore((s) => s.setColorMode);
  const theme = useUiStore((s) => s.theme);
  const updatePreferences = useUpdatePreferences();
  const user = useAuthStore((s) => s.user);

  function handleSelect(mode: ColorMode) {
    setColorMode(mode); // optimistic DOM + store update
    onClose();
    updatePreferences.mutate({ theme: theme || user?.preferences?.theme || "light", colorMode: mode });
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
      {COLOR_MODES.map((mode) => (
        <button
          key={mode}
          type="button"
          role="menuitem"
          onClick={() => handleSelect(mode)}
          className={cn(
            "flex h-8 w-full items-center gap-2 rounded-sm px-2.5 text-left text-sm text-text transition-colors",
            "hover:bg-surface-muted focus-visible:outline-none focus-visible:bg-surface-muted",
          )}
        >
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-[3px]"
            style={{ backgroundColor: SWATCHES[mode] }}
          />
          <span className="flex-1 truncate">{LABELS[mode]}</span>
          {colorMode === mode && <Check className="h-3.5 w-3.5 shrink-0 text-accent" />}
        </button>
      ))}
    </Popover>
  );
}
