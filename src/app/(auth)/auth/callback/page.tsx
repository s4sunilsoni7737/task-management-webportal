"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "../../../../store/authStore";
import { GlobalLoader } from "../../../../components/ui/global-loader";
import { routes } from "../../../../lib/routeBuilder";

/**
 * Handles the redirect back from Google OAuth. The backend issues a JWT
 * and redirects to /auth/callback?token=<accessToken>. This page captures
 * the token, hydrates the auth store, and navigates to the Tasks page.
 * The full user profile is fetched by AuthBootstrap via GET /users/me.
 */
function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSession = useAuthStore((s) => s.setSession);
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const token = searchParams.get("token");
    if (!token) {
      router.replace(routes.login());
      return;
    }

    // Placeholder user — AuthBootstrap immediately calls GET /users/me
    // with the token and replaces this with the real profile.
    setSession(token, {
      id: "",
      name: "",
      email: null,
      avatarUrl: null,
      isGuest: false,
      preferences: { theme: "light", colorMode: "blue" },
    });
    router.replace(routes.tasks());
  }, [router, searchParams, setSession]);

  return (
    <div className="fixed inset-0">
      <GlobalLoader />
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0">
          <GlobalLoader />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}