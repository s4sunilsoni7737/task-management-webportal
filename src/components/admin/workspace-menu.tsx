"use client";

import { useRef, useState } from "react";
import { Check, Moon, Palette, Settings, Sun, LogOut } from "lucide-react";
import { Popover } from "@/components/ui/popover";
import { MenuItem } from "@/components/ui/menu";
import { Avatar } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useUiStore } from "@/store/uiStore";
import { useUpdatePreferences } from "@/hooks/useUsers";
import { COLOR_MODES, type ColorMode, type ThemeMode } from "@/lib/types";
import { cn } from "@/lib/utils";
import { DEFAULT_WORKSPACE_NAME } from "@/constants";

interface WorkspaceMenuProps {
  open: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement>;
}

type SubmenuKey = "theme" | "colorMode" | null;

/**
 * Profile popover opened from the bottom-anchored user block in the
 * sidebar. Per design_break_down.md §3.1.5: avatar centered, name + email,
 * then Change Theme / Color Mode / Settings rows with nested submenus.
 */
export function WorkspaceMenu({ open, onClose, anchorRef }: WorkspaceMenuProps) {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const [submenu, setSubmenu] = useState<SubmenuKey>(null);
  const themeRowRef = useRef<HTMLDivElement>(null!);
  const colorModeRowRef = useRef<HTMLDivElement>(null!);

  function closeAll() {
    setSubmenu(null);
    onClose();
  }

  return (
    <>
      <Popover
        open={open}
        onClose={closeAll}
        anchorRef={anchorRef}
        side="top"
        align="start"
        offset={8}
        className="w-[200px] p-1"
        disableDismiss={submenu !== null}
      >
        <div className="flex flex-col items-center gap-1.5 border-b border-border px-2 pb-3 pt-2">
          <Avatar name={user?.name ?? DEFAULT_WORKSPACE_NAME} size="lg" />
          <div className="text-center">
            <p className="text-sm font-semibold text-text">{user?.name ?? DEFAULT_WORKSPACE_NAME}</p>
            <p className="truncate text-xs text-text-subtle">
              {user?.email ?? `${DEFAULT_WORKSPACE_NAME.toLowerCase()}@gmail.com`}
            </p>
          </div>
        </div>

        <div className="pt-1">
          <div ref={themeRowRef}>
            <MenuItem
              icon={Sun}
              label="Change Theme"
              hasSubmenu
              onClick={() => setSubmenu(submenu === "theme" ? null : "theme")}
            />
          </div>
          <div ref={colorModeRowRef}>
            <MenuItem
              icon={Palette}
              label="Color Mode"
              hasSubmenu
              onClick={() => setSubmenu(submenu === "colorMode" ? null : "colorMode")}
            />
          </div>
          <MenuItem
            icon={Settings}
            label="Settings"
            href="/settings/profile"
            onClick={closeAll}
          />
        </div>
        <div className="border-t border-border mt-1 pt-1">
          <MenuItem
            icon={LogOut}
            label="Log out"
            destructive
            onClick={() => {
              useAuthStore.getState().clear();
              router.push("/login");
            }}
          />
        </div>
      </Popover>

      <ThemeSubmenu
        open={open && submenu === "theme"}
        onClose={closeAll}
        anchorRef={themeRowRef}
      />
      <ColorModeSubmenu
        open={open && submenu === "colorMode"}
        onClose={closeAll}
        anchorRef={colorModeRowRef}
      />
    </>
  );
}

const THEME_OPTIONS: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
];

interface ThemeSubmenuProps {
  open: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement>;
}

/** Light/Dark submenu opened from the "Change Theme" row in WorkspaceMenu. */
function ThemeSubmenu({ open, onClose, anchorRef }: ThemeSubmenuProps) {
  const theme = useUiStore((s) => s.theme);
  const colorMode = useUiStore((s) => s.colorMode);
  const setTheme = useUiStore((s) => s.setTheme);
  const updatePreferences = useUpdatePreferences();
  const user = useAuthStore((s) => s.user);

  function handleSelect(value: ThemeMode) {
    setTheme(value); // optimistic DOM + store update
    onClose();
    // Persist to the backend — the source of truth for this preference.
    updatePreferences.mutate({ theme: value, colorMode: colorMode || user?.preferences?.colorMode || "blue" });
  }

  return (
    <Popover open={open} onClose={onClose} anchorRef={anchorRef} side="right" align="start" offset={4} className="w-[150px] p-1">
      {THEME_OPTIONS.map((option) => (
        <MenuItem key={option.value} icon={option.icon} label={option.label} selected={theme === option.value} onClick={() => handleSelect(option.value)} />
      ))}
    </Popover>
  );
}

const SWATCHES: Record<ColorMode, string> = {
  amber: "#F59E0B", blue: "#6D5DF5", pink: "#EC4899", rose: "#F43F5E", emerald: "#0F9F6E", black: "#111111",
};
const LABELS: Record<ColorMode, string> = {
  amber: "Amber", blue: "Blue", pink: "Pink", rose: "Rose", emerald: "Emerald", black: "Black",
};

interface ColorModeSubmenuProps {
  open: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement>;
}

/** Color mode submenu opened from the "Color Mode" row in WorkspaceMenu. */
function ColorModeSubmenu({ open, onClose, anchorRef }: ColorModeSubmenuProps) {
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
    <Popover open={open} onClose={onClose} anchorRef={anchorRef} side="right" align="start" offset={4} className="w-[150px] p-1">
      {COLOR_MODES.map((mode) => (
        <button key={mode} type="button" role="menuitem" onClick={() => handleSelect(mode)} className={cn("flex h-8 w-full items-center gap-2 rounded-sm px-2.5 text-left text-sm text-text transition-colors", "hover:bg-surface-muted focus-visible:outline-none focus-visible:bg-surface-muted")}>
          <span className="h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ backgroundColor: SWATCHES[mode] }} />
          <span className="flex-1 truncate">{LABELS[mode]}</span>
          {colorMode === mode && <Check className="h-3.5 w-3.5 shrink-0 text-accent" />}
        </button>
      ))}
    </Popover>
  );
}

