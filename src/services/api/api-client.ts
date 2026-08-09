import axios from "axios";
import { API_BASE_URL } from "../../../constants";

/**
 * Single shared Axios instance for the whole app.
 * NEVER import `axios` directly in a service or component — always go
 * through `request()` in `api-handler.ts`, which uses this instance.
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30_000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
