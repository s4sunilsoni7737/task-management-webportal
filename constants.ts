/**
 * Global application constants.
 * Central place for environment-driven configuration so nothing is
 * hardcoded inside components or services.
 */

// Base URL for the backend API. When no real backend is deployed yet,
// this points at the app's own Next.js Route Handlers, which serve as
// an in-memory mock API (see src/app/api/**). Swap NEXT_PUBLIC_API_URL
// to a real NestJS backend URL when it is available — the service layer
// does not need to change.
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";

// Toggles verbose console logging for API calls / mock latency, etc.
export const DEV_MODE = process.env.NODE_ENV !== "production";

// Simulated network latency (ms) for the mock API layer, so loading
// states are visible during development. Set to 0 to disable.
export const MOCK_LATENCY_MS = 350;

export const APP_NAME = "Pyramid";
export const DEFAULT_WORKSPACE_NAME = "Dexter";
