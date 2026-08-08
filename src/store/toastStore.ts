import { create } from "zustand";
import { getErrorMessage } from "../services/api/api-error-handler";

export interface ToastItem {
  id: string;
  variant: "success" | "error" | "info";
  message: string;
}

interface ToastState {
  toasts: ToastItem[];
  push: (toast: Omit<ToastItem, "id">) => void;
  dismiss: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: crypto.randomUUID() }],
    })),
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

/**
 * Imperative helper so any service/hook/component can push a toast
 * without needing to be a React component: `toast.success("Saved")`.
 */
export const toast = {
  success(message: string) {
    useToastStore.getState().push({ variant: "success", message });
  },
  error(error: unknown, fallback = "Something went wrong.") {
    const message = error ? getErrorMessage(error) : fallback;
    useToastStore.getState().push({ variant: "error", message: message || fallback });
  },
  info(message: string) {
    useToastStore.getState().push({ variant: "info", message });
  },
};
