"use client";

import { useState } from "react";
import { Paperclip, X } from "lucide-react";
import { tasksService } from "../../../../services/tasks/tasks.service";
import { toast } from "../../../../store/toastStore";

/**
 * "Resources" row per design_break_down.md Â§6. Lets the user attach a
 * document/link by name + URL, wired to POST /tasks/:id/resources.
 */
export function ResourcesRow({ taskId }: { taskId: string }) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [pending, setPending] = useState(false);

  function submit() {
    const trimmedName = name.trim();
    const trimmedUrl = url.trim();
    if (!trimmedName || !trimmedUrl) return;
    setPending(true);
    tasksService
      .addResource(taskId, { name: trimmedName, url: trimmedUrl })
      .then(() => {
        toast.success("Resource attached");
        setName("");
        setUrl("");
        setAdding(false);
      })
      .catch(() => toast.error("Couldn't attach resource"))
      .finally(() => setPending(false));
  }

  return (
    <div className="mb-5">
      <p className="mb-1.5 text-xs font-medium text-text-subtle">Resources</p>
      {adding ? (
        <div className="flex flex-col gap-2 rounded-sm border border-border p-2">
          <div className="flex items-center gap-2">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name (e.g. Design spec.pdf)"
              className="h-8 min-w-0 flex-1 rounded-sm border border-border bg-surface px-2 text-sm text-text outline-none placeholder:text-text-subtle"
            />
            <button
              type="button"
              aria-label="Cancel"
              onClick={() => {
                setAdding(false);
                setName("");
                setUrl("");
              }}
              className="flex h-7 w-7 items-center justify-center rounded-sm text-text-subtle hover:bg-surface-muted hover:text-text"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
              }}
              placeholder="https://..."
              className="h-8 min-w-0 flex-1 rounded-sm border border-border bg-surface px-2 text-sm text-text outline-none placeholder:text-text-subtle"
            />
            <button
              type="button"
              onClick={submit}
              disabled={pending || !name.trim() || !url.trim()}
              className="h-8 rounded-sm bg-accent px-3 text-sm font-medium text-white transition-opacity disabled:opacity-50"
            >
              {pending ? "Addingâ€¦" : "Add"}
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="flex h-9 w-full items-center gap-2 rounded-sm border border-dashed border-border px-2.5 text-left text-sm text-text-subtle transition-colors hover:border-accent hover:text-accent"
        >
          <Paperclip className="h-3.5 w-3.5" />
          Add document or link...
        </button>
      )}
    </div>
  );
}
