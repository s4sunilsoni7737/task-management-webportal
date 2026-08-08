"use client";

import { CollapsiblePanel } from "../ui/collapsible-panel";
import { CommentItem } from "./comment-item";
import { CommentComposer } from "./comment-composer";
import { EmptyState } from "../ui/empty-state";
import { useComments, useAddComment } from "../../hooks/useTaskDetail";
import { MessageSquare } from "lucide-react";

/** Comments/discussion area — list, inline reply row, and the primary composer, per design_break_down.md §6. */
export function CommentsSection({ taskId }: { taskId: string }) {
  const { data: comments = [], isLoading } = useComments(taskId);
  const addComment = useAddComment(taskId);

  return (
    <CollapsiblePanel title="Comments" count={comments.length} defaultOpen>
      {isLoading ? (
        <div className="h-24 animate-pulse rounded-md bg-surface-muted" />
      ) : (
        <div className="rounded-md border border-border">
          {comments.length === 0 ? (
            <EmptyState icon={MessageSquare} title="No comments yet" description="Start the discussion below." />
          ) : (
            <div className="divide-y divide-border px-3">
              {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>
          )}
          <div className="border-t border-border p-2.5">
            <CommentComposer
              compact
              placeholder="Leave a reply..."
              pending={addComment.isPending}
              onSubmit={(body) => addComment.mutate(body)}
            />
          </div>
        </div>
      )}

      <div className="mt-3">
        <CommentComposer pending={addComment.isPending} onSubmit={(body) => addComment.mutate(body)} />
      </div>
    </CollapsiblePanel>
  );
}
