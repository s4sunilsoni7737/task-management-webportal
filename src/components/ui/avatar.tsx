import { Plus } from "lucide-react";
import type { Member } from "../../lib/types";
import { cn } from "../../lib/utils";
import { getInitials } from "../../lib/utils/formatters";

type AvatarSize = "xs" | "sm" | "md" | "lg";

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: AvatarSize;
  className?: string;
  ring?: boolean;
}

const SIZE_CLASSES: Record<AvatarSize, string> = {
  xs: "h-5 w-5 text-[9px]",
  sm: "h-6 w-6 text-[10px]",
  md: "h-7 w-7 text-xs",
  lg: "h-9 w-9 text-sm",
};

const PALETTE = ["#6D5DF5", "#0F9F6E", "#F59E0B", "#F04444", "#3B82F6", "#EC4899"];

function colorForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return PALETTE[Math.abs(hash) % PALETTE.length]!;
}

/** Circular avatar used across sidebar, avatar stacks, comments, and member pickers. */
export function Avatar({ name, src, size = "sm", className, ring }: AvatarProps) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        className={cn(
          "shrink-0 rounded-full object-cover",
          SIZE_CLASSES[size],
          ring && "ring-2 ring-surface",
          className,
        )}
      />
    );
  }

  return (
    <div
      title={name}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-medium text-white",
        SIZE_CLASSES[size],
        ring && "ring-2 ring-surface",
        className,
      )}
      style={{ backgroundColor: colorForName(name) }}
    >
      {getInitials(name)}
    </div>
  );
}

interface AvatarStackProps {
  members: Member[];
  max?: number;
  size?: "xs" | "sm" | "md";
  onAdd?: () => void;
  className?: string;
}

/**
 * Overlapping avatar stack used in Task rows/cards, Project rows, and the
 * Details panel. Renders an empty "add member" circle when there are no
 * members yet, per design_break_down.md ("Light gray circular plus button").
 */
export function AvatarStack({ members, max = 3, size = "sm", onAdd, className }: AvatarStackProps) {
  if (members.length === 0) {
    return (
      <button
        type="button"
        onClick={onAdd}
        aria-label="Add member"
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-full border border-dashed border-border-strong text-text-subtle transition-colors hover:border-accent hover:text-accent",
          className,
        )}
      >
        <Plus className="h-3 w-3" />
      </button>
    );
  }

  const visible = members.slice(0, max);
  const overflow = members.length - visible.length;

  return (
    <div className={cn("flex items-center -space-x-1.5", className)}>
      {visible.map((member) => (
        <Avatar key={member.id} name={member.name} src={member.avatarUrl} size={size} ring />
      ))}
      {overflow > 0 && (
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-muted text-[10px] font-medium text-text-muted ring-2 ring-surface">
          +{overflow}
        </div>
      )}
      {onAdd && (
        <button
          type="button"
          onClick={onAdd}
          aria-label="Add member"
          className="flex h-6 w-6 items-center justify-center rounded-full border border-dashed border-border-strong text-text-subtle ring-2 ring-surface transition-colors hover:border-accent hover:text-accent"
        >
          <Plus className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
