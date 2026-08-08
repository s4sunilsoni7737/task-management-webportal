import { Plus } from "lucide-react";
import { Avatar } from "./avatar";
import type { Member } from "../../lib/types";
import { cn } from "../../lib/utils";

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
