/**
 * Global application constants.
 * Central place for environment-driven configuration so nothing is
 * hardcoded inside components or services.
 */

// Base URL for the backend API. Points at the real NestJS backend.
// The backend runs on http://localhost:8000 with global prefix /api and
// URI versioning /v1, so the full base is http://localhost:8000/api/v1.
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

// Toggles verbose console logging for API calls / mock latency, etc.
export const DEV_MODE = process.env.NODE_ENV !== "production";

export const APP_NAME = "Pyramid";
export const DEFAULT_WORKSPACE_NAME = "Dexter";