/**
 * Global application constants.
 * Central place for environment-driven configuration so nothing is
 * hardcoded inside components or services.
 */

// Base URL for the backend API.
// Defaults to the deployed Vercel backend unless NEXT_PUBLIC_API_URL is set.
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://task-management-api-gold.vercel.app/api/v1";

// Toggles verbose console logging for API calls / mock latency, etc.
export const DEV_MODE = process.env.NODE_ENV !== "production";

export const APP_NAME = "Pyramid";
export const DEFAULT_WORKSPACE_NAME = "Dexter";