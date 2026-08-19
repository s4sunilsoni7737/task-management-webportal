"use client";

import { useState, useRef } from "react";
import { MessageSquare, Paperclip, SendHorizontal, Smile, X, Loader2, Send } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { OverflowMenu } from "@/components/ui/menu";
import { useAuthStore } from "@/store/authStore";
import { useAddComment, useComments, useDeleteComment, useUpdateComment } from "@/hooks/useTaskDetail";
import { formatRelativeTime } from "@/lib/utils/formatters";
import { DEFAULT_WORKSPACE_NAME } from "@/constants";
import type { Comment } from "@/lib/types";

interface CommentComposerProps {
  onSubmit: (input: { body: string; file?: File }) => void;
  pending?: boolean;
  placeholder?: string;
  compact?: boolean;
}

function CommentComposer({ onSubmit, pending, placeholder = "Add a comment...", compact }: CommentComposerProps) {
  const user = useAuthStore((s) => s.user);
  const [value, setValue] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function submit() {
    const trimmed = value.trim();
    if (!trimmed && !file) return;
    onSubmit({ body: trimmed, file: file || undefined });
    setValue("");
    setFile(null);
  }

  return (
    <div className="flex flex-col gap-2">
      {file && (
        <div className="flex items-center justify-between rounded-md border border-border bg-surface px-3 py-2 text-sm text-text">
          <span className="truncate">{file.name}</span>
          <button type="button" onClick={() => setFile(null)} className="text-text-muted hover:text-text">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      <div className={`flex items-center gap-2.5 rounded-md border border-border bg-surface px-3 ${compact ? "h-10" : "h-[52px]"}`}>
        {compact && <Avatar name={user?.name ?? DEFAULT_WORKSPACE_NAME} size="xs" />}
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder={placeholder}
          disabled={pending}
          className="min-w-0 flex-1 bg-transparent text-sm text-text outline-none placeholder:text-text-subtle"
        />
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setFile(e.target.files[0]);
            }
          }}
        />
        <button
          type="button"
          aria-label="Attach file"
          onClick={() => fileInputRef.current?.click()}
          disabled={pending}
          className="flex h-7 w-7 items-center justify-center rounded-sm text-text-subtle hover:bg-surface-muted hover:text-text disabled:cursor-not-allowed"
        >
          <Paperclip className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          aria-label="Send comment"
          onClick={submit}
          disabled={pending || (!value.trim() && !file)}
          className="flex h-7 w-7 items-center justify-center rounded-sm text-accent transition-colors hover:bg-accent-soft disabled:cursor-not-allowed disabled:text-text-subtle disabled:hover:bg-transparent"
        >
          {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <SendHorizontal className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}

interface CommentItemProps {
  comment: Comment;
  taskId: string;
}

function CommentItem({ comment, taskId }: CommentItemProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(comment.body);
  const updateComment = useUpdateComment(taskId, comment.id);
  const deleteComment = useDeleteComment(taskId, comment.id);

  function saveEdit() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== comment.body) {
      updateComment.mutate(trimmed);
    }
    setEditing(false);
  }

  return (
    <div className="flex gap-2.5 py-3">
      <Avatar name={comment.author.name} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-text">{comment.author.name}</span>
          <span className="text-xs text-text-subtle">{formatRelativeTime(comment.createdAt)}</span>
        </div>
        {editing ? (
          <textarea
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                saveEdit();
              }
              if (e.key === "Escape") {
                setDraft(comment.body);
                setEditing(false);
              }
            }}
            className="mt-0.5 w-full resize-none rounded-sm border border-accent bg-surface px-2 py-1 text-sm text-text outline-none"
          />
        ) : (
          <div>
            <p className="mt-0.5 text-sm text-text-muted whitespace-pre-wrap">{comment.body}</p>
            {comment.attachments && comment.attachments.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {comment.attachments.map((att, idx) => (
                  <a
                    key={idx}
                    href={att.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs text-text-muted hover:bg-surface-muted hover:text-text transition-colors"
                  >
                    <Paperclip className="h-3 w-3" />
                    <span className="truncate max-w-[200px]">{att.name}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex shrink-0 items-start gap-1">
        <button
          type="button"
          aria-label="Add reaction"
          className="flex h-7 w-7 items-center justify-center rounded-sm text-text-subtle hover:bg-surface-muted hover:text-text"
        >
          <Smile className="h-3.5 w-3.5" />
        </button>
        <OverflowMenu
          label={`Actions for comment by ${comment.author.name}`}
          onEdit={() => {
            setDraft(comment.body);
            setEditing(true);
          }}
          onDelete={() => deleteComment.mutate()}
        />
      </div>
    </div>
  );
}

export function CommentsSection({ taskId }: { taskId: string }) {
  const { data: comments = [], isLoading } = useComments(taskId);
  const addComment = useAddComment(taskId);

  return (
    <div className="mt-8">
      <h2 className="mb-4 text-base font-semibold text-text">Comments</h2>
      {isLoading ? (
        <div className="h-24 animate-pulse rounded-lg bg-surface-muted" />
      ) : (
        <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-3 shadow-[0px_1px_1px_0px_#0000000A,0px_3px_6px_-2px_#00000005]">
          {comments.length === 0 ? (
            <EmptyState icon={MessageSquare} title="No comments yet" description="Start the discussion below." />
          ) : (
            <div className="divide-y divide-border px-3">
              {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} taskId={taskId} />
              ))}
            </div>
          )}
          <div className="border-t border-border pt-3">
            <CommentComposer
              compact
              placeholder="Leave a reply..."
              pending={addComment.isPending}
              onSubmit={(input) => addComment.mutate(input)}
            />
          </div>
        </div>
      )}

      <div className="mt-3">
        <CommentComposer pending={addComment.isPending} onSubmit={(input) => addComment.mutate(input)} />
      </div>
    </div>
  );
}
