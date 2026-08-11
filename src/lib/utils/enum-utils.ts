import type { ComponentType, CSSProperties } from "react";
import {
  Archive,
  BarChart2,
  Circle,
  CircleCheck,
  CircleDashed,
  CircleDot,
  CirclePause,
  Minus,
  Signal,
  SignalHigh,
  SignalMedium,
  SignalLow,
} from "lucide-react";
import type { Priority, TaskStatus } from "@/lib/types/enums";

export interface PriorityConfig {
  label: string;
  icon: ComponentType<{ className?: string; style?: CSSProperties }>;
  colorVar: string; // CSS var name, e.g. "--dx-priority-high"
}

export const PRIORITY_CONFIG: Record<Priority, PriorityConfig> = {
  no_priority: { label: "No Priority", icon: Minus, colorVar: "--dx-text-subtle" },
  urgent: { label: "Urgent", icon: Signal, colorVar: "--dx-priority-urgent" },
  high: { label: "High", icon: SignalHigh, colorVar: "--dx-priority-high" },
  medium: { label: "Medium", icon: SignalMedium, colorVar: "--dx-priority-medium" },
  low: { label: "Low", icon: SignalLow, colorVar: "--dx-priority-low" },
};

export interface StatusConfig {
  label: string;
  icon: ComponentType<{ className?: string; style?: CSSProperties }>;
  colorVar: string;
}

export const STATUS_CONFIG: Record<TaskStatus, StatusConfig> = {
  backlog: { label: "Backlog", icon: Archive, colorVar: "--dx-text-subtle" },
  todo: { label: "To Do", icon: CircleDashed, colorVar: "--dx-text-subtle" },
  doing: { label: "Doing", icon: CircleDot, colorVar: "--dx-priority-medium" },
  on_hold: { label: "On Hold", icon: CirclePause, colorVar: "--dx-priority-low" },
  completed: { label: "Completed", icon: CircleCheck, colorVar: "--dx-accent" },
};

// Kept for compatibility: `Circle` was the previous "empty" status icon.
export const EMPTY_CIRCLE_ICON = Circle;
