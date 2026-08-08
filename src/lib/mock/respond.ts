import { NextResponse } from "next/server";
import { MOCK_LATENCY_MS } from "../../../constants";

/** Simulates network latency so loading states are visible in dev. */
export async function mockDelay(ms: number = MOCK_LATENCY_MS) {
  if (ms <= 0) return;
  await new Promise((resolve) => setTimeout(resolve, ms));
}

/** Wraps a payload in the `{ data: T }` envelope the frontend's `request()` expects. */
export function jsonOk<T>(data: T, init?: number) {
  return NextResponse.json({ data }, { status: init ?? 200 });
}

export function jsonError(message: string, status = 400, code?: string) {
  return NextResponse.json({ message, code }, { status });
}
