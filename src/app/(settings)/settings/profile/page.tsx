"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/authStore";
import { DEFAULT_WORKSPACE_NAME } from "@/constants";

export default function ProfileSettingsPage() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  
  // Local state for the mock fields
  const [fullName, setFullName] = useState(user?.name || DEFAULT_WORKSPACE_NAME);
  const [title, setTitle] = useState("Designer");
  const [username, setUsername] = useState("Dexuser");

  function handleLeaveWorkspace() {
    // In a real app, this would hit an API endpoint to leave the workspace.
    // For now, we'll just log the user out.
    useAuthStore.getState().clear();
    router.push("/login");
  }

  return (
    <div className="mx-auto max-w-4xl px-8 py-16">
      <h1 className="mb-8 text-2xl font-semibold text-text">Profile</h1>

      <div className="mb-10 overflow-hidden rounded-xl border border-border bg-surface">
        <div className="flex flex-col">
          {/* Profile Picture */}
          <div className="flex items-center justify-between border-b border-border p-6">
            <span className="text-sm font-medium text-text">Profile picture</span>
            <Avatar name={user?.name || DEFAULT_WORKSPACE_NAME} size="lg" className="h-10 w-10" />
          </div>

          {/* Email */}
          <div className="flex items-center justify-between border-b border-border p-6">
            <span className="text-sm font-medium text-text">Email</span>
            <div className="flex items-center gap-3">
              <span className="text-sm text-text-muted">{user?.email || "dexter@gmail.com"}</span>
              <button type="button" className="text-text-subtle hover:text-text transition-colors">
                <Pencil className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Full name */}
          <div className="flex items-center justify-between border-b border-border p-6">
            <div className="w-1/3 pr-4">
              <span className="text-sm font-medium text-text">Full name</span>
            </div>
            <div className="w-2/3 max-w-md">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-10 w-full rounded-md border-transparent bg-surface-muted px-4 text-sm text-text outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              />
            </div>
          </div>

          {/* Title */}
          <div className="flex items-center justify-between border-b border-border p-6">
            <div className="w-1/3 pr-4">
              <span className="block text-sm font-medium text-text">Title</span>
              <span className="mt-0.5 block text-xs text-text-subtle">Your job title or role</span>
            </div>
            <div className="w-2/3 max-w-md">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-10 w-full rounded-md border-transparent bg-surface-muted px-4 text-sm text-text outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              />
            </div>
          </div>

          {/* Username */}
          <div className="flex items-center justify-between p-6">
            <div className="w-1/3 pr-4">
              <span className="block text-sm font-medium text-text">Username</span>
              <span className="mt-0.5 block text-xs text-text-subtle">One word, like a nickname or first name</span>
            </div>
            <div className="w-2/3 max-w-md">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-10 w-full rounded-md border-transparent bg-surface-muted px-4 text-sm text-text outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      <h2 className="mb-4 text-lg font-semibold text-text">Workspace access</h2>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border bg-surface p-6">
        <span className="text-sm text-text-subtle">Remove yourself from the workspace</span>
        <button
          type="button"
          onClick={handleLeaveWorkspace}
          className="shrink-0 rounded-md bg-danger-soft px-4 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger/10"
        >
          Leave Workspace
        </button>
      </div>
    </div>
  );
}
