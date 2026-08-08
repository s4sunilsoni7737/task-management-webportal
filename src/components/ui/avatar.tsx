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
