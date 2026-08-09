"use client";

import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { GoogleIcon } from "../../../components/ui/icons/google-icon";
import { PyramidMark } from "../../../components/ui/icons/pyramid-mark";
import { useGuestLogin } from "../../../hooks/useAuth";
import { authService } from "../../../services/auth/auth.service";

export default function LoginPage() {
  const guestLogin = useGuestLogin();

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-[380px]">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <PyramidMark className="h-10 w-10" />
          <span className="text-lg font-semibold tracking-tight text-text">Pyramid</span>
        </div>

        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold text-text">Let&apos;s get back on track</h1>
          <p className="mt-1.5 text-sm text-text-muted">
            Enter your email below to login to your account.
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          <Button
            variant="black"
            className="h-10 w-full"
            onClick={() => guestLogin.mutate()}
            disabled={guestLogin.isPending}
          >
            {guestLogin.isPending ? "Signing in…" : "Continue as Guest"}
          </Button>

          <Button
            variant="outline"
            className="h-10 w-full gap-2"
            onClick={() => authService.loginWithGoogle()}
          >
            <GoogleIcon className="h-4 w-4" />
            Login with Google
          </Button>
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-text-subtle">
          By continuing, you agree to our{" "}
          <Link href="#" className="underline hover:text-text-muted">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="underline hover:text-text-muted">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
