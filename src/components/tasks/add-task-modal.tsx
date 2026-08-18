"use client";

import { useState, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MemberPicker } from "@/components/ui/member-picker";
import { AvatarStack } from "@/components/ui/avatar";
import { useCreateTask } from "@/hooks/useTasks";
import { useMembers } from "@/hooks/useLookups";
import { toast } from "@/store/toastStore";
import { TASK_STATUSES, PRIORITIES, type Priority, type TaskStatus } from "@/lib/types";

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  projectId?: string | null;
  defaultStatus?: TaskStatus;
}

/**
 * "+ Add Task" modal per AbleSpace_Assignment_Process_Flow §2 step 7:
 * entering a name creates the task with a default status (To Do) and it
 * immediately appears in both views. Also lets the user pick priority.
 */
export function AddTaskModal({ open, onClose, projectId, defaultStatus = "todo" }: AddTaskModalProps) {
  const createTask = useCreateTask();
  const { data: allMembers = [] } = useMembers();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);
  const [priority, setPriority] = useState<Priority>("no_priority");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [memberIds, setMemberIds] = useState<string[]>([]);
  
  const [membersOpen, setMembersOpen] = useState(false);
  const membersAnchorRef = useRef<HTMLDivElement>(null!);

  if (!open) return null;

  function submit() {
    const trimmed = title.trim();
    if (!trimmed) return;
    
    const todayStr = new Date().toISOString().split("T")[0];
    if (startDate && startDate < todayStr) {
      toast.error("Start date cannot be in the past");
      return;
    }
    if (dueDate) {
      if (startDate && dueDate < startDate) {
        toast.error("Due date cannot be before start date");
        return;
      } else if (!startDate && dueDate < todayStr) {
        toast.error("Due date cannot be in the past");
        return;
      }
    }

    createTask.mutate(
      { 
        title: trimmed, 
        description: description.trim(),
        status, 
        priority, 
        projectId: projectId ?? null,
        memberIds,
        startDate: startDate || null,
        dueDate: dueDate || null
      },
      {
        onSuccess: () => {
          setTitle("");
          setDescription("");
          setStatus(defaultStatus);
          setPriority("no_priority");
          setStartDate("");
          setDueDate("");
          setMemberIds([]);
          onClose();
        },
      },
    );
  }

  const selectedMembers = allMembers.filter(m => memberIds.includes(m.id));

  function toggleMember(id: string) {
    setMemberIds(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
  }

  return (
    <div
      className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center bg-black/30 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[380px] rounded-md border border-border bg-surface p-4 shadow-popover"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text">New Task</h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-sm text-text-subtle hover:bg-surface-muted hover:text-text"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <label className="mb-1 block text-xs font-medium text-text-subtle">Task name</label>
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
            if (e.key === "Escape") onClose();
          }}
          placeholder="What needs to be done?"
          className="mb-3 h-9 w-full rounded-sm border border-border bg-surface px-2.5 text-sm text-text outline-none placeholder:text-text-subtle focus:border-accent"
        />

        <label className="mb-1 block text-xs font-medium text-text-subtle">Description (Optional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add more details..."
          rows={3}
          className="mb-3 w-full resize-none rounded-sm border border-border bg-surface p-2 text-sm text-text outline-none placeholder:text-text-subtle focus:border-accent scrollbar-thin"
        />

        <div className="mb-3 grid grid-cols-3 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-text-subtle">Start Date</label>
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-9 w-full rounded-sm border border-border bg-surface px-2 text-[13px] text-text outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-subtle">Due Date</label>
            <input
              type="date"
              min={startDate || new Date().toISOString().split("T")[0]}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="h-9 w-full rounded-sm border border-border bg-surface px-2 text-[13px] text-text outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-subtle">Assignees</label>
            <div ref={membersAnchorRef} className="h-9 flex items-center">
              <AvatarStack members={selectedMembers} size="sm" onAdd={() => setMembersOpen(true)} />
            </div>
            <MemberPicker
              open={membersOpen}
              onClose={() => setMembersOpen(false)}
              anchorRef={membersAnchorRef}
              members={allMembers}
              selectedIds={memberIds}
              onToggle={toggleMember}
            />
          </div>
        </div>

        <label className="mb-1 block text-xs font-medium text-text-subtle">Status</label>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {TASK_STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`h-8 flex-1 rounded-sm border text-xs capitalize transition-colors ${
                status === s
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-border bg-surface text-text-muted hover:bg-surface-muted"
              }`}
            >
              {s.replace("_", " ")}
            </button>
          ))}
        </div>

        <label className="mb-1 block text-xs font-medium text-text-subtle">Priority</label>
        <div className="mb-4 flex gap-1.5">
          {PRIORITIES.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={`h-8 flex-1 rounded-sm border text-xs capitalize transition-colors ${
                priority === p
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-border bg-surface text-text-muted hover:bg-surface-muted"
              }`}
            >
              {p.replace("_", " ")}
            </button>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="accent"
            size="sm"
            onClick={submit}
            isLoading={createTask.isPending}
            disabled={!title.trim() || createTask.isPending}
          >
            {createTask.isPending ? "Creating…" : "Create Task"}
          </Button>
        </div>
      </div>
    </div>
  );
}