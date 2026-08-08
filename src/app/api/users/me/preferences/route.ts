import { jsonOk, mockDelay } from "../../../../../lib/mock/respond";
import type { UserPreferences } from "../../../../../lib/types";

/**
 * PATCH /api/users/me/preferences
 * Scope of Work: "PATCH /users/me/preferences — Persist theme + colour mode".
 * The frontend also persists to localStorage immediately (see uiStore) so
 * theme changes apply before this round-trip resolves; this endpoint is the
 * authenticated-user persistence path once real accounts exist.
 */
export async function PATCH(request: Request) {
  await mockDelay();
  const body = (await request.json()) as UserPreferences;
  return jsonOk(body);
}
