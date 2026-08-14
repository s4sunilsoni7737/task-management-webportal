"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Search, User, Sun, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

export function SettingsSidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/settings/profile", icon: User, label: "Profile" },
    { href: "#", icon: Sun, label: "Theme" },
    { href: "#", icon: Palette, label: "Color" },
  ];

  return (
    <aside className="hidden shrink-0 border-r border-border bg-sidebar transition-[width] duration-150 md:flex w-64 h-full flex-col">
      <div className="flex h-14 items-center px-4">
        <Link href="/tasks" className="flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to app
        </Link>
      </div>

      <div className="p-3 flex-1 overflow-y-auto">
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-subtle" />
          <input 
            type="text" 
            placeholder="Search" 
            className="h-9 w-full rounded-md border border-border bg-surface pl-9 pr-3 text-sm text-text placeholder:text-text-subtle focus:border-accent focus:outline-none"
          />
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex h-9 items-center gap-2.5 rounded-sm px-2.5 text-sm font-medium transition-colors",
                  active ? "bg-surface text-text shadow-sm" : "text-text-muted hover:bg-surface-muted hover:text-text",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
