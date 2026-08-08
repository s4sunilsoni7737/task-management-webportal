"use client";

import { Smile } from "lucide-react";
import { Avatar } from "../ui/avatar";
import { OverflowMenu } from "../ui/overflow-menu";
import { formatRelativeTime } from "../../lib/utils/formatters";
import type { Comment } from "../../lib/types";

/**
 * Single comment card — avatar, author, relative timestamp, body, and a
 * reaction/overflow affordance, per design_break_down.md §6.
 * TODO(comments): reactions and edit/delete are UI-only placeholders;
 * wire up once the backend supports comment mutations beyond create.
 */
export function CommentItem({ comment }: { comment: Comment }) {
  return (
    <div className="flex gap-2.5 py-3">
      <Avatar name={comment.author.name} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-text">{comment.author.name}</span>
          <span className="text-xs text-text-subtle">{formatRelativeTime(comment.createdAt)}</span>
        </div>
        <p className="mt-0.5 text-sm text-text-muted">{comment.body}</p>
      </div>
      <div className="flex shrink-0 items-start gap-1">
        <button
          type="button"
          aria-label="Add reaction"
          className="flex h-7 w-7 items-center justify-center rounded-sm text-text-subtle hover:bg-surface-muted hover:text-text"
        >
          <Smile className="h-3.5 w-3.5" />
        </button>
        <OverflowMenu label={`Actions for comment by ${comment.author.name}`} onEdit={() => {}} onDelete={() => {}} />
      </div>
    </div>
  );
}
