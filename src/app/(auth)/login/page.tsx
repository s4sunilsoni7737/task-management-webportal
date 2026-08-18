"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useGuestLogin } from "@/hooks/useAuth";
import { authService } from "@/services/auth/auth.service";

export default function LoginPage() {
  const guestLogin = useGuestLogin();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg p-4">
      <div className="flex w-full max-w-[420px] flex-col items-center">
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-accent-fg">
            <svg viewBox="0 0 40 40" className="h-full w-full" fill="none">
              <path d="M20 10L11 26L20 30L29 26L20 10Z" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round" />
              <path d="M20 10V30" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-[15px] font-bold text-text">Pyramid</span>
        </div>

        <div className="w-full rounded-2xl border border-border bg-surface p-7 shadow-sm">
          <h1 className="mb-1 text-center text-[18px] font-bold text-text">
            Let&apos;s get back on track
          </h1>
          <p className="mb-5 text-center text-[13px] text-text-muted">
            Enter your email below to login to your account.
          </p>

          <div className="flex flex-col gap-2">
            <Button
              variant="accent"
              className="h-10 w-full rounded-full"
              onClick={() => guestLogin.mutate()}
              disabled={guestLogin.isPending}
            >
              {guestLogin.isPending ? "Signing in…" : "Continue as Guest"}
            </Button>

            <Button
              variant="outline"
              className="h-10 w-full gap-2 rounded-full"
              onClick={() => authService.loginWithGoogle()}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47c-.28 1.5-1.13 2.78-2.4 3.63v3.02h3.89c2.28-2.1 3.56-5.2 3.56-8.84z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.89-3.02c-1.08.72-2.46 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.94H1.28v3.11C3.26 21.3 7.31 24 12 24z" />
                <path fill="#FBBC05" d="M5.29 14.29a7.2 7.2 0 010-4.58V6.6H1.28a12 12 0 000 10.8l4.01-3.11z" />
                <path fill="#EA4335" d="M12 4.75c1.76 0 3.35.61 4.6 1.8l3.45-3.45C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.28 6.6l4.01 3.11C6.23 6.87 8.88 4.75 12 4.75z" />
              </svg>
              Login with Google
            </Button>
          </div>
        </div>

        <p className="mt-4 text-center text-[11px] leading-relaxed text-text-subtle">
          By clicking continue, you agree to
          <br />
          our{" "}
          <Link href="#" className="text-text-muted underline hover:text-text">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="text-text-muted underline hover:text-text">
            Privacy
          </Link>
          <br />
          <Link href="#" className="text-text-muted underline hover:text-text">
            Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
