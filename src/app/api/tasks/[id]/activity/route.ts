import { jsonOk, mockDelay } from "../../../../../lib/mock/respond";
import { getActivityOf } from "../../../../../lib/mock/db";

interface Params {
  params: { id: string };
}

/** GET /api/tasks/[id]/activity — Scope of Work: GET /tasks/:id/activity */
export async function GET(_request: Request, { params }: Params) {
  await mockDelay();
  return jsonOk(getActivityOf(params.id));
}
