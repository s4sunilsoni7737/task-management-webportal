import { AxiosError } from "axios";
import { ApiError, type ApiFieldError } from "@/services/api/api-error";

interface BackendErrorBody {
  statusCode?: number;
  success?: boolean;
  userMessage?: string;
  developerMessage?: string;
  message?: string | string[];
  error?: string;
  code?: string;
  errors?: ApiFieldError[];
  /** NestJS often nests details inside `data` (e.g. validation responses). */
  data?: {
    message?: string | string[];
    errors?: ApiFieldError[];
  };
}

/** Converts any thrown value (AxiosError, generic Error, unknown) into an ApiError. */
export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (error instanceof AxiosError) {
    const status = error.response?.status ?? null;
    const body = error.response?.data as BackendErrorBody | undefined;

    if (!error.response) {
      return new ApiError("Unable to reach the server. Check your connection.", {
        status: null,
        code: "NETWORK_ERROR",
      });
    }

    // The backend always responds with `{ success, userMessage, developerMessage, data }`.
    // Prefer `developerMessage` (more descriptive) then `userMessage` (human-readable), and fall back to
    // generic `message` from NestJS/express.
    const rawMessage = body?.developerMessage ?? body?.userMessage ?? body?.message ?? body?.data?.message;
    const message = Array.isArray(rawMessage)
      ? rawMessage.join(", ")
      : rawMessage || body?.error || error.message || "Something went wrong.";

    return new ApiError(message, {
      status,
      code: body?.code ?? null,
      fieldErrors: body?.errors ?? body?.data?.errors ?? [],
    });
  }

  if (error instanceof Error) {
    return new ApiError(error.message);
  }

  return new ApiError("An unexpected error occurred.");
}

/** Convenience helper for toasts / inline banners. */
export function getErrorMessage(error: unknown, fallback = "An unexpected error occurred."): string {
  return normalizeApiError(error).message || fallback;
}
