import { QueryClient, QueryCache } from "@tanstack/react-query";
import { useToastStore } from "../store/toastStore";
import { getErrorMessage } from "../services/api/api-error-handler";

/**
 * One QueryClient per browser session (created lazily in providers.tsx so it
 * survives Fast Refresh but not SSR request boundaries).
 *
 * Queries get a GLOBAL error toast via `QueryCache.onError`. Mutations do
 * their own toasting inside `useApiMutation` — the MutationCache handler is
 * intentionally omitted so we never double-toast a write failure.
 */
export function makeQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        useToastStore.getState().push({
          variant: "error",
          message: getErrorMessage(error),
        });
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 0, // Always refetch on mount so detail/edit pages never show stale data
        gcTime: 5 * 60_000,
        retry: false, // Never silently retry
        refetchOnWindowFocus: false, // Don't refetch on tab switch to avoid hammering the API
      },
      mutations: {
        retry: false, // never silently retry a state-changing action
      },
    },
  });
}

/** Backwards-compatible alias used by providers.tsx. */
export function createQueryClient() {
  return makeQueryClient();
}
