import { jsonOk, mockDelay } from "../../../lib/mock/respond";
import { labels } from "../../../lib/mock/db";

/** GET /api/labels — workspace-level label taxonomy. */
export async function GET() {
  await mockDelay();
  return jsonOk(labels);
}
