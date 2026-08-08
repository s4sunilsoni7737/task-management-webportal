import { v4 as uuid } from "uuid";
import { mockDelay, jsonOk } from "../../../../lib/mock/respond";
import type { User } from "../../../../lib/types";

/**
 * POST /api/auth/guest
 * Creates an anonymous guest session. Mirrors the real NestJS
 * `AuthModule.guest()` endpoint described in the Scope of Work
 * (POST /auth/guest — "Create anonymous session/JWT").
 */
export async function POST() {
  await mockDelay();

  const guestId = uuid();
  const user: User = {
    id: `guest-${guestId}`,
    name: "Dexter",
    email: null,
    avatarUrl: null,
    isGuest: true,
    preferences: { theme: "light", colorMode: "blue" },
  };

  // Mock token — in a real backend this would be a signed JWT.
  const accessToken = `mock-guest-token.${guestId}`;

  return jsonOk({ accessToken, user });
}
