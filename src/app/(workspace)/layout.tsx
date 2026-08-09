"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "../../components/shell/app-shell";
import { GlobalLoader } from "../../components/ui/global-loader";
import { useAuthStore } from "../../store/authStore";
import { useMembers, useLabels } from "../../hooks/useLookups";
import { routes } from "../../lib/routeBuilder";

/**
 * Layout for all authenticated workspace routes (Tasks, Projects, Task
 * Detail). Redirects to /login when there is no active session — guest or
 * otherwise. Wraps children in the shared AppShell (sidebar + content) and
 * prefetches the shared lookups (members + labels) that every page's
 * Filters/Fields/Member-pickers depend on.
 */
export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);

  // Prefetch shared lookups immediately when entering the workspace.
  useMembers();
  useLabels();

  useEffect(() => {
    if (!accessToken) router.replace(routes.login());
  }, [accessToken, router]);

  if (!accessToken) {
    return (
      <div className="fixed inset-0">
        <GlobalLoader />
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
