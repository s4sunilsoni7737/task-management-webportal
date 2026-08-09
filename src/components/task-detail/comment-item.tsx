"use client";

import { useState } from "react";
import { Smile } from "lucide-react";
import { Avatar } from "../ui/avatar";
import { OverflowMenu } from "../ui/overflow-menu";
import { formatRelativeTime } from "../../lib/utils/formatters";
import { useUpdateComment, useDeleteComment } from "../../hooks/useTaskDetail";
import type { Comment } from "../../lib/types";

interface CommentItemProps {
  comment: Comment;
  taskId: string;
}

/**
 * Single comment card — avatar, author, relative timestamp, body, and a
 * reaction/overflow affordance, per design_break_down.md §6.
 * Edit/Delete are wired to the backend via useUpdateComment/useDeleteComment.
 */
export function CommentItem({ comment, taskId }: CommentItemProps) {
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
          <p className="mt-0.5 text-sm text-text-muted">{comment.body}</p>
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
