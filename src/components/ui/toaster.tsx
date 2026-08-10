"use client";

import { useEffect } from "react";
import { CheckCircle2, X, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToastStore, type ToastItem } from "@/store/toastStore";

const ICONS: Record<ToastItem["variant"], React.ElementType> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const VARIANT_STYLES: Record<ToastItem["variant"], string> = {
  success: "text-[#0F9F6E]",
  error: "text-priority-high",
  info: "text-accent",
};

function ToastRow({ toast }: { toast: ToastItem }) {
  const dismiss = useToastStore((s) => s.dismiss);
  const Icon = ICONS[toast.variant];

  useEffect(() => {
    const timer = setTimeout(() => dismiss(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, dismiss]);

  return (
    <div
      role="status"
      className="animate-fade-in-scale flex w-80 items-start gap-2.5 rounded-md border border-border bg-surface p-3 shadow-popover"
    >
      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", VARIANT_STYLES[toast.variant])} />
      <p className="flex-1 text-sm text-text">{toast.message}</p>
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => dismiss(toast.id)}
        className="text-text-subtle hover:text-text"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-toast flex flex-col gap-2">
      {toasts.map((t) => (
        <ToastRow key={t.id} toast={t} />
      ))}
    </div>
  );
}
