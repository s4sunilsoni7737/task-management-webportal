import { Paperclip } from "lucide-react";

/**
 * "Resources" row per design_break_down.md §6. File/link attachments are
 * not part of the graded Scope of Work, so this renders the placeholder
 * UI only.
 *
 * TODO(resources): wire up to a real attachments endpoint
 * (POST /tasks/:id/resources) once file storage is available on the
 * backend.
 */
export function ResourcesRow() {
  return (
    <div className="mb-5">
      <p className="mb-1.5 text-xs font-medium text-text-subtle">Resources</p>
      <button
        type="button"
        disabled
        className="flex h-9 w-full items-center gap-2 rounded-sm border border-dashed border-border px-2.5 text-left text-sm text-text-subtle disabled:cursor-not-allowed"
      >
        <Paperclip className="h-3.5 w-3.5" />
        Add document or link...
      </button>
    </div>
  );
}
