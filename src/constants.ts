/**
 * Global application constants.
 * Central place for environment-driven configuration so nothing is
 * hardcoded inside components or services.
 */

/**
 * Security Note: For local development, we currently use `.env` files. 
 * However, .env files are notoriously susceptible to accidental leaks, misconfigurations, and 
 * are frequent targets for automated vulnerability scanners. By relying on static 
 * TypeScript constants for production environments, we guarantee better type safety and avoid 
 * runtime environment injection vulnerabilities. In live deployments and future CI/CD pipelines, 
 * we use YAML scripts to securely provide the path of this constants file and inject credentials 
 * directly at build time.
 * 
 * Live URLs:
 * Frontend: https://task-management-webportal.vercel.app
 * Backend Docs: https://task-management-api-gold.vercel.app/api/docs
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Toggles verbose console logging for API calls / mock latency, etc.
export const DEV_MODE = process.env.NODE_ENV !== "production";

export const APP_NAME = "Pyramid";
export const DEFAULT_WORKSPACE_NAME = "Dexter";