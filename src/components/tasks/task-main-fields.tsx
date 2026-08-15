"use client";

import { useRef, useState } from "react";
import { Paperclip, Plus, X } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { DateChip, LabelChip } from "@/components/ui/badge";
import { CollapsiblePanel } from "@/components/ui/collapsible-panel";
import { EmptyState } from "@/components/ui/empty-state";
import { InlineAddTaskRow } from "@/components/tasks/inline-add-task-row";
import { TaskTable } from "@/components/tasks/task-table";
import { DEFAULT_TASK_FIELDS } from "@/components/tasks/task-fields";
import { DatePickerPopover } from "@/components/tasks/task-details-sidebar";
import { useLabels } from "@/hooks/useLookups";
import { useAddSubtask } from "@/hooks/useTaskDetail";
import { useSubtasks } from "@/hooks/useTasks";
import { tasksService } from "@/services/tasks/tasks.service";
import { toast } from "@/store/toastStore";
import type { Task, UpdateTaskInput, Label } from "@/lib/types";
import { Popover } from "@/components/ui/popover";
import { Check } from "lucide-react";

interface TaskHeaderProps {
  task: Task;
  onSave: (input: UpdateTaskInput) => void;
  isEditing?: boolean;
}

export function TaskHeader({ task, onSave, isEditing }: TaskHeaderProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  return (
    <div className="mb-5">
      {isEditing ? (
        <textarea
          value={title}
          rows={1}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => {
            if (title.trim() && title !== task.title) onSave({ title: title.trim() });
            else setTitle(task.title);
          }}
          className="w-full resize-none overflow-hidden border-none bg-transparent text-2xl font-bold text-text outline-none focus:ring-1 focus:ring-accent rounded-sm px-1"
        />
      ) : (
        <h1 className="text-2xl font-bold text-text px-1 whitespace-pre-wrap">{task.title}</h1>
      )}

      {isEditing ? (
        <textarea
          value={description}
          rows={2}
          placeholder="Add a description..."
          onChange={(e) => setDescription(e.target.value)}
          onBlur={() => {
            if (description !== task.description) onSave({ description });
          }}
          className="mt-1 w-full resize-none border-none bg-transparent text-sm leading-relaxed text-text-muted outline-none placeholder:text-text-subtle focus:ring-1 focus:ring-accent rounded-sm px-1"
        />
      ) : (
        <div className="mt-1 text-sm leading-relaxed text-text-muted px-1 whitespace-pre-wrap">
          {task.description || <span className="text-text-subtle italic">No description provided.</span>}
        </div>
      )}
    </div>
  );
}

interface PropertiesRowProps {
  task: Task;
  onOpenDatePicker: () => void;
  dateAnchorRef: React.RefObject<HTMLDivElement>;
}

export function PropertiesRow({ task, onOpenDatePicker, dateAnchorRef }: PropertiesRowProps) {
  return (
    <div className="mb-4 flex items-start gap-4">
      <div className="w-24 shrink-0 pt-1 text-sm font-semibold text-text">Properties</div>
      <div className="flex flex-wrap items-center gap-3">
        {task.reporter && (
          <div className="flex items-center gap-1.5 text-[12px] font-medium text-text">
            <Avatar name={task.reporter.name} size="xs" className="text-text-muted bg-surface-muted" />
            {task.reporter.name}
          </div>
        )}
        <div ref={dateAnchorRef}>
          <DateChip date={task.dueDate} onClick={onOpenDatePicker} />
        </div>
      </div>
    </div>
  );
}

interface LabelPickerProps {
  open: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement>;
  labels: Label[];
  selectedIds: string[];
  onToggle: (labelId: string) => void;
}

function LabelPicker({ open, onClose, anchorRef, labels, selectedIds, onToggle }: LabelPickerProps) {
  return (
    <Popover open={open} onClose={onClose} anchorRef={anchorRef} align="start" className="w-[180px] p-1">
      <p className="px-2.5 py-1.5 text-xs font-medium text-text-subtle">Labels</p>
      {labels.map((label) => {
        const selected = selectedIds.includes(label.id);
        return (
          <button
            key={label.id}
            type="button"
            onClick={() => onToggle(label.id)}
            className="flex h-8 w-full items-center gap-2 rounded-sm px-2.5 text-left text-sm text-text transition-colors hover:bg-surface-muted"
          >
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: label.color }} />
            <span className="flex-1 truncate">{label.name}</span>
            {selected && <Check className="h-3.5 w-3.5 shrink-0 text-accent" />}
          </button>
        );
      })}
    </Popover>
  );
}

interface LabelsRowProps {
  task: Task;
  onChange: (labelIds: string[]) => void;
  isEditing?: boolean;
}

export function LabelsRow({ task, onChange, isEditing }: LabelsRowProps) {
  const { data: allLabels = [] } = useLabels();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null!);

  function toggle(labelId: string) {
    const ids = task.labels.map((l) => l.id);
    onChange(ids.includes(labelId) ? ids.filter((id) => id !== labelId) : [...ids, labelId]);
  }

  return (
    <div className="mb-4 flex items-start gap-4">
      <div className="w-24 shrink-0 pt-1 text-sm font-semibold text-text">Labels</div>
      <div className="flex flex-wrap items-center gap-1.5">
        {task.labels.map((label) => (
          <LabelChip key={label.id} label={label} onRemove={isEditing ? () => toggle(label.id) : undefined} />
        ))}
        {isEditing && (
          <button
            ref={anchorRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Add label"
            className={
              task.labels.length === 0
                ? "text-xs text-text-subtle hover:text-text cursor-pointer transition-colors"
                : "flex h-[20px] w-[20px] items-center justify-center rounded-full border border-dashed border-border-strong text-text-subtle hover:border-accent hover:text-accent"
            }
          >
            {task.labels.length === 0 ? "Add labels..." : <Plus className="h-2.5 w-2.5" />}
          </button>
        )}
      </div>
      <LabelPicker
        open={open}
        onClose={() => setOpen(false)}
        anchorRef={anchorRef}
        labels={allLabels}
        selectedIds={task.labels.map((l) => l.id)}
        onToggle={toggle}
      />
    </div>
  );
}

export function ResourcesRow({ task, isEditing }: { task: Task; isEditing?: boolean }) {
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
      .addResource(task.id, { name: trimmedName, url: trimmedUrl })
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
    <div className="mb-8 flex items-start gap-4">
      <div className="w-24 shrink-0 pt-1 text-sm font-semibold text-text">Resources</div>
      <div className="min-w-0 flex-1 flex flex-col gap-2">
      {task.resources && task.resources.length > 0 && (
        <div className="flex flex-col gap-2">
          {task.resources.map((res) => (
            <div key={res.id} className="group flex items-center justify-between gap-2">
              <a
                href={res.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-text hover:text-accent transition-colors truncate"
              >
                <Paperclip className="h-3.5 w-3.5 text-text-subtle" />
                <span className="truncate">{res.name}</span>
              </a>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Remove this resource?")) {
                      tasksService
                        .removeResource(task.id, res.id)
                        .then(() => toast.success("Resource removed"))
                        .catch(() => toast.error("Couldn't remove resource"));
                    }
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-text-subtle hover:text-red-500 transition-colors"
                  aria-label="Remove resource"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      {isEditing && (
        <>
          {!adding ? (
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="flex items-center gap-1.5 text-[12px] text-text-muted hover:text-text transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Add document or link...
            </button>
          ) : (
            <div className="flex flex-col gap-2 rounded-sm border border-border p-2">
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  placeholder="Title (e.g. Figma Design)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  placeholder="URL (https://...)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submit();
                  }}
                  className="h-8 min-w-0 flex-1 rounded-sm border border-border bg-surface px-2 text-sm text-text outline-none placeholder:text-text-subtle"
                />
                <button
                  type="button"
                  onClick={submit}
                  disabled={pending || !name.trim() || !url.trim()}
                  className="h-8 rounded-sm bg-accent px-3 text-sm font-medium text-white transition-opacity disabled:opacity-50"
                >
                  {pending ? "Adding..." : "Add"}
                </button>
              </div>
            </div>
          )}
        </>
      )}
      </div>
    </div>
  );
}

export function SubtasksSection({ task, isEditing }: { task: Task; isEditing?: boolean }) {
  const { data: subtasks = [], isLoading } = useSubtasks(task.id);
  const addSubtask = useAddSubtask(task.id);

  if (!isEditing && subtasks.length === 0) return null;

  return (
    <CollapsiblePanel title="Subtasks" count={subtasks.length} defaultOpen className="mb-5">
      {isLoading ? (
        <div className="h-20 animate-pulse rounded-md bg-surface-muted" />
      ) : subtasks.length === 0 ? (
        <div className="rounded-md border border-dashed border-border">
          <EmptyState title="No subtasks yet" />
          {isEditing && (
            <div className="border-t border-border px-1 py-1">
              <InlineAddTaskRow
                onAdd={(title) => addSubtask.mutate(title)}
                pending={addSubtask.isPending}
                label="Add a subtask..."
              />
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          <TaskTable tasks={subtasks} visibleFields={DEFAULT_TASK_FIELDS} />
          {isEditing && (
            <InlineAddTaskRow
              onAdd={(title) => addSubtask.mutate(title)}
              pending={addSubtask.isPending}
              label="Add a subtask..."
            />
          )}
        </div>
      )}
    </CollapsiblePanel>
  );
}
