import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";
import { toast } from "../store/toastStore";

interface UseApiMutationOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  successMessage?: string;
  errorMessage?: string;
  invalidateQueries?: QueryKey[];
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: unknown) => void;
}

/**
 * Wraps `useMutation` with the app's standard side effects: a success/error
 * toast and query invalidation. Use this for anything that writes data;
 * use plain `useQuery` for reads.
 */
export function useApiMutation<TData, TVariables = void>({
  mutationFn,
  successMessage,
  errorMessage,
  invalidateQueries = [],
  onSuccess,
  onError,
}: UseApiMutationOptions<TData, TVariables>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (data, variables) => {
      if (successMessage) toast.success(successMessage);
      invalidateQueries.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
      onSuccess?.(data, variables);
    },
    onError: (error) => {
      toast.error(error, errorMessage);
      onError?.(error);
    },
  });
}
