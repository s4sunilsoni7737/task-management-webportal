"use client";

import { Eye, Lock, LockOpen, MoreHorizontal, PanelRight, Share2, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { IconButton } from "../ui/icon-button";
import { Popover } from "../ui/popover";
import { MenuItem } from "../ui/menu-item";
import { toast } from "../../store/toastStore";
import type { Task } from "../../lib/types";

interface TaskDetailActionsProps {
  task: Task;
  onToggleLock: () => void;
  onDelete: () => void;
  panelOpen: boolean;
  onTogglePanel: () => void;
}

/** Right-aligned Task Detail top-bar actions — Lock, watcher count, Share, Overflow, Panel toggle. */
export function TaskDetailActions({
  task,
  onToggleLock,
  onDelete,
  panelOpen,
  onTogglePanel,
}: TaskDetailActionsProps) {
  const [overflowOpen, setOverflowOpen] = useState(false);
  const overflowRef = useRef<HTMLButtonElement>(null!);

  return (
    <>
      <IconButton aria-label={task.isLocked ? "Unlock task" : "Lock task"} onClick={onToggleLock}>
        {task.isLocked ? <Lock className="h-4 w-4" /> : <LockOpen className="h-4 w-4" />}
      </IconButton>

      <div className="flex h-8 items-center gap-1 rounded-sm px-2 text-text-muted">
        <Eye className="h-4 w-4" />
        <span className="text-xs">{task.watcherCount}</span>
      </div>

      <IconButton
        aria-label="Share task"
        onClick={() => {
          navigator.clipboard?.writeText(window.location.href).catch(() => {});
          toast.success("Link copied to clipboard");
        }}
      >
        <Share2 className="h-4 w-4" />
      </IconButton>

      <IconButton
        ref={overflowRef}
        aria-label="More actions"
        active={overflowOpen}
        onClick={() => setOverflowOpen((v) => !v)}
      >
        <MoreHorizontal className="h-4 w-4" />
      </IconButton>
      <Popover
        open={overflowOpen}
        onClose={() => setOverflowOpen(false)}
        anchorRef={overflowRef}
        align="end"
        className="w-[150px] p-1"
      >
        <MenuItem
          icon={Trash2}
          label="Delete task"
          destructive
          onClick={() => {
            onDelete();
            setOverflowOpen(false);
          }}
        />
      </Popover>

      <IconButton aria-label="Toggle details panel" active={panelOpen} onClick={onTogglePanel}>
        <PanelRight className="h-4 w-4" />
      </IconButton>
    </>
  );
}
