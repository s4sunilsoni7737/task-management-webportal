"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { GlobalLoader } from "@/components/ui/global-loader";

export default function RootPage() {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    router.replace(accessToken ? "/tasks" : "/login");
  }, [accessToken, router]);

  return (
    <div className="fixed inset-0">
      <GlobalLoader />
    </div>
  );
}
