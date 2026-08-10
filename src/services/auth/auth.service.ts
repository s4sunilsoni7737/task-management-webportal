import { request } from "@/services/api/api-handler";
import { API_ENDPOINTS } from "@/services/api/endpoints";
import { normalizeUser } from "@/lib/utils/normalize";
import type { User, Workspace } from "@/lib/types";

export interface GuestSessionResponse {
  accessToken: string;
  user: User; // already nested `preferences` from `_buildAuthResponse`; normalized defensively
  workspace: Workspace;
}

export const authService = {
  /** Creates an anonymous guest session — the assignment's required primary CTA. */
  async loginAsGuest(): Promise<GuestSessionResponse> {
    const session = await request<GuestSessionResponse>({
      url: API_ENDPOINTS.AUTH.GUEST,
      method: "POST",
    });
    return { ...session, user: normalizeUser(session.user) };
  },

  /**
   * Google OAuth is server-driven: navigating the browser to `GET /auth/google`
   * redirects to Google's consent screen, and the callback flow returns to
   * `/auth/callback?token=...` on this app.
   */
  loginWithGoogle(): void {
    window.location.href = API_ENDPOINTS.AUTH.GOOGLE;
  },
};
