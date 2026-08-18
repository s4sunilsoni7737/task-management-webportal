import { create } from "zustand";
import { getErrorMessage } from "@/services/api/api-error-handler";

export interface ToastItem {
  id: string;
  variant: "success" | "error" | "info" | "loading";
  message: string;
}

interface ToastState {
  toasts: ToastItem[];
  push: (toast: Omit<ToastItem, "id">, id?: string) => string;
  dismiss: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (toast, explicitId) => {
    const id = explicitId || crypto.randomUUID();
    set((state) => {
      // If updating an existing toast
      if (state.toasts.some(t => t.id === id)) {
        return { toasts: state.toasts.map(t => t.id === id ? { ...t, ...toast } : t) };
      }
      return { toasts: [...state.toasts, { ...toast, id }] };
    });
    return id;
  },
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

/**
 * Imperative helper so any service/hook/component can push a toast
 * without needing to be a React component: `toast.success("Saved")`.
 */
export const toast = {
  success(message: string, id?: string) {
    return useToastStore.getState().push({ variant: "success", message }, id);
  },
  error(error: unknown, fallback = "Something went wrong.", id?: string) {
    const message = error ? getErrorMessage(error) : fallback;
    return useToastStore.getState().push({ variant: "error", message: message || fallback }, id);
  },
  info(message: string, id?: string) {
    return useToastStore.getState().push({ variant: "info", message }, id);
  },
  loading(message: string, id?: string) {
    return useToastStore.getState().push({ variant: "loading", message }, id);
  },
  dismiss(id: string) {
    useToastStore.getState().dismiss(id);
  }
};
