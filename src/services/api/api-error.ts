export interface ApiFieldError {
  field: string;
  message: string;
}

/**
 * Normalized error shape used everywhere in the app. Every failed request
 * eventually surfaces as one of these, regardless of whether the failure
 * came from the network, a non-2xx response, or an unexpected exception.
 */
export class ApiError extends Error {
  readonly status: number | null;
  readonly code: string | null;
  readonly fieldErrors: ApiFieldError[];

  constructor(
    message: string,
    options: {
      status?: number | null;
      code?: string | null;
      fieldErrors?: ApiFieldError[];
    } = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.status = options.status ?? null;
    this.code = options.code ?? null;
    this.fieldErrors = options.fieldErrors ?? [];
  }
}
