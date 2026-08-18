import { request } from "@/services/api/api-handler";
import { API_ENDPOINTS } from "@/services/api/endpoints";
import { API_BASE_URL } from "@/constants";
import { normalizeUser } from "@/lib/utils/normalize";
import type { User, Workspace } from "@/lib/types";

export interface GuestSessionResponse {
  accessToken: string;
  user: User; // already nested `preferences` from `_buildAuthResponse`; normalized defensively
  workspace: Workspace;
}

export const authService = {
  /** Creates an anonymous demo session */
  async loginAsDemo(role: 'owner' | 'member'): Promise<GuestSessionResponse> {
    const session = await request<GuestSessionResponse>({
      url: API_ENDPOINTS.AUTH.DEMO(role),
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
    window.location.href = `${API_BASE_URL}${API_ENDPOINTS.AUTH.GOOGLE}`;
  },
};
