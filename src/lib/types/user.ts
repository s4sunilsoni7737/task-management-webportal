import type { ColorMode, ThemeMode } from "@/lib/types/enums";

export interface UserPreferences {
  theme: ThemeMode;
  colorMode: ColorMode;
}

export interface User {
  id: string;
  name: string;
  email: string | null;
  avatarUrl: string | null;
  isGuest: boolean;
  preferences: UserPreferences;
  workspaceId: string | null;
}

/** Minimal shape used for member pickers / avatar stacks across the app. */
export interface Member {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role?: string;
}
