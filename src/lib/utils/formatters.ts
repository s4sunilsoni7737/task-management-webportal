import { format, formatDistanceToNowStrict, isValid, parseISO } from "date-fns";

/** Formats an ISO date string as "12 Sep 2026" — the compact format used across tables/chips. */
export function formatDate(value: string | null | undefined): string {
  if (!value) return "";
  const date = typeof value === "string" ? parseISO(value) : value;
  if (!isValid(date)) return "";
  return format(date, "d MMM yyyy");
}

/** Short form used in dense chips, e.g. "31 Jul". */
export function formatDateShort(value: string | null | undefined): string {
  if (!value) return "";
  const date = parseISO(value);
  if (!isValid(date)) return "";
  return format(date, "d MMM");
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "";
  const date = parseISO(value);
  if (!isValid(date)) return "";
  return format(date, "d MMM yyyy, h:mm a");
}

/** Relative timestamp for comments/activity, e.g. "3 minutes ago", "just now". */
export function formatRelativeTime(value: string | null | undefined): string {
  if (!value) return "";
  const date = parseISO(value);
  if (!isValid(date)) return "";
  const diffMs = Date.now() - date.getTime();
  if (diffMs < 60_000) return "just now";
  return formatDistanceToNowStrict(date, { addSuffix: true });
}

/** Initials fallback for avatars without an image, e.g. "Ankit Dutta" -> "AD". */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0]}${parts[parts.length - 1]![0]}`.toUpperCase();
}
