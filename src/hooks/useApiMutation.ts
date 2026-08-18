import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";
import { toast } from "@/store/toastStore";

interface UseApiMutationOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  /** Success toast message, or a function to derive it from the response/variables. */
  successMessage?: string | ((data: TData, variables: TVariables) => string);
  /** Pending toast message. If true, defaults to "Processing...". */
  pendingMessage?: string | boolean;
  /** Fallback error message when the backend doesn't provide one. */
  errorMessage?: string;
  /** Query keys to invalidate on success. */
  invalidateQueries?: QueryKey[];
  /** Page-specific success logic (close modals, clear forms, navigate, etc.). */
  onSuccess?: (data: TData, variables: TVariables) => void;
  /** Page-specific error logic (reset pending state, set field errors, etc.). */
  onError?: (error: unknown, variables: TVariables) => void;
  /** Called after success or error — always runs. */
  onSettled?: (data: TData | undefined, error: unknown, variables: TVariables) => void;
}

/**
 * Wraps `useMutation` with the app's standard side-effects, mirroring the
 * reference project's centralized mutation layer:
 *   1. Success toast (optional, string or derived from the response)
 *   2. Error toast (extracts the backend message via `getErrorMessage`)
 *   3. Query invalidation (from `invalidateQueries`)
 *   4. Page-specific `onSuccess` / `onError` / `onSettled` callbacks
 *
 * Use this for anything that writes data; use plain `useQuery` for reads.
 */
export function useApiMutation<TData, TVariables = void>({
  mutationFn,
  successMessage,
  pendingMessage,
  errorMessage,
  invalidateQueries = [],
  onSuccess,
  onError,
  onSettled,
}: UseApiMutationOptions<TData, TVariables>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onMutate: () => {
      if (pendingMessage) {
        const msg = typeof pendingMessage === "string" ? pendingMessage : "Processing...";
        // We generate an ID and store it on the mutation context so we can dismiss it later
        const toastId = toast.loading(msg);
        return { toastId };
      }
    },
    onSuccess: async (data, variables, context: any) => {
      if (successMessage) {
        const message =
          typeof successMessage === "function" ? successMessage(data, variables) : successMessage;
        toast.success(message, context?.toastId);
      } else if (context?.toastId) {
        toast.dismiss(context.toastId);
      }
      await Promise.all(
        invalidateQueries.map((key) => queryClient.invalidateQueries({ queryKey: key }))
      );
      onSuccess?.(data, variables);
    },
    onError: (error, variables, context: any) => {
      toast.error(error, errorMessage ?? "Operation failed", context?.toastId);
      onError?.(error, variables);
    },
    onSettled: (data, error, variables, context: any) => {
      if (context?.toastId && !successMessage && !error) {
         // Fallback dismiss if no success message was shown
         toast.dismiss(context.toastId);
      }
      onSettled?.(data, error, variables);
    },
  });
}
