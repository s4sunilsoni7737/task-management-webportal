"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";

export default function OnboardingPage() {
  const completeOnboardingOwner = useOnboarding();
  const completeOnboardingMember = useOnboarding();
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    if (user?.workspaceId) {
      router.replace('/tasks');
    }
  }, [user?.workspaceId, router]);

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
            Welcome, {user?.name ?? 'there'}!
          </h1>
          <p className="mb-5 text-center text-[13px] text-text-muted">
            You're almost done. Choose a role to get started.
          </p>

          <div className="flex flex-col gap-2">
            <Button
              variant="accent"
              className="h-10 w-full rounded-full"
              onClick={() => completeOnboardingOwner.mutate('owner')}
              disabled={completeOnboardingOwner.isPending || completeOnboardingMember.isPending}
            >
              {completeOnboardingOwner.isPending ? "Setting up..." : "Continue as Owner"}
            </Button>
            
            <Button
              variant="outline"
              className="h-10 w-full rounded-full"
              onClick={() => completeOnboardingMember.mutate('member')}
              disabled={completeOnboardingOwner.isPending || completeOnboardingMember.isPending}
            >
              {completeOnboardingMember.isPending ? "Setting up..." : "Continue as Member"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
