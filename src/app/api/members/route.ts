import { jsonOk, mockDelay } from "../../../lib/mock/respond";
import { members } from "../../../lib/mock/db";

/** GET /api/members — used by the member picker across tasks/projects. */
export async function GET() {
  await mockDelay();
  return jsonOk(members);
}
