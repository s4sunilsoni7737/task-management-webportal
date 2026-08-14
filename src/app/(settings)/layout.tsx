"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SettingsSidebar } from "@/components/admin/settings-sidebar";
import { GlobalLoader } from "@/components/ui/global-loader";
import { useAuthStore } from "@/store/authStore";
import { routes } from "@/lib/routeBuilder";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);

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

  return (
    <div className="flex h-screen w-full overflow-hidden bg-surface">
      <SettingsSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
