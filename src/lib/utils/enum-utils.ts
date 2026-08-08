import type { ComponentType, CSSProperties } from "react";
import {
  BarChart2,
  Circle,
  CircleDashed,
  CircleDot,
  CircleCheck,
  CirclePause,
  ChevronsUp,
  ChevronUp,
  Minus,
  SignalLow,
} from "lucide-react";
import type { Priority, TaskStatus } from "../types/enums";

export interface PriorityConfig {
  label: string;
  icon: ComponentType<{ className?: string; style?: CSSProperties }>;
  colorVar: string; // CSS var name, e.g. "--dx-priority-high"
}

export const PRIORITY_CONFIG: Record<Priority, PriorityConfig> = {
  no_priority: { label: "No Priority", icon: Minus, colorVar: "--dx-text-subtle" },
  urgent: { label: "Urgent", icon: ChevronsUp, colorVar: "--dx-priority-urgent" },
  high: { label: "High", icon: BarChart2, colorVar: "--dx-priority-high" },
  medium: { label: "Medium", icon: ChevronUp, colorVar: "--dx-priority-medium" },
  low: { label: "Low", icon: SignalLow, colorVar: "--dx-priority-low" },
};

export interface StatusConfig {
  label: string;
  icon: ComponentType<{ className?: string; style?: CSSProperties }>;
  colorVar: string;
}

export const STATUS_CONFIG: Record<TaskStatus, StatusConfig> = {
  todo: { label: "To Do", icon: CircleDashed, colorVar: "--dx-text-subtle" },
  doing: { label: "Doing", icon: CircleDot, colorVar: "--dx-priority-medium" },
  completed: { label: "Completed", icon: CircleCheck, colorVar: "--dx-accent" },
  on_hold: { label: "On Hold", icon: CirclePause, colorVar: "--dx-priority-low" },
};

// Fallback export kept for completeness/discoverability of the "empty" icon set.
export const EMPTY_CIRCLE_ICON = Circle;
