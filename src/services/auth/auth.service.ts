import { request } from "../api/api-handler";
import { API_ENDPOINTS } from "../api/endpoints";
import type { User } from "../../lib/types";

export interface GuestSessionResponse {
  accessToken: string;
  user: User;
}

export const authService = {
  /** Creates an anonymous guest session — the assignment's required primary CTA. */
  loginAsGuest(): Promise<GuestSessionResponse> {
    return request<GuestSessionResponse>({
      url: API_ENDPOINTS.AUTH.GUEST,
      method: "POST",
    });
  },

  /**
   * TODO(auth): Google OAuth is shown in the reference UI as a secondary
   * CTA. Wire this up once a real backend OAuth strategy is available —
   * for now this redirects to a not-yet-implemented backend route.
   */
  loginWithGoogle(): void {
    window.location.href = API_ENDPOINTS.AUTH.GOOGLE;
  },
};
