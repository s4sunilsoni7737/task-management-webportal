"use client";

import { useRef, useState } from "react";
import { Paperclip, Plus, X, ExternalLink } from "lucide-react";
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
import { AttachmentPreviewModal, getFileIcon } from "@/components/tasks/attachment-preview-modal";
import { Button } from "@/components/ui/button";

interface TaskHeaderProps {
  task: Task;
  onSave: (input: UpdateTaskInput) => void;
  isEditing?: boolean;
  setEditing?: (editing: boolean) => void;
}

export function TaskHeader({ task, onSave, isEditing, setEditing }: TaskHeaderProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  return (
    <div className="mb-5">
      {isEditing ? (
        <textarea
          value={title}
          rows={1}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full resize-none overflow-hidden border-none bg-transparent text-3xl font-bold tracking-tight text-text outline-none focus:ring-1 focus:ring-accent rounded-sm px-1 mb-2"
        />
      ) : (
        <h1 className="text-3xl font-bold text-text px-1 whitespace-pre-wrap tracking-tight">{task.title}</h1>
      )}

      {isEditing ? (
        <div className="flex flex-col gap-3">
          <textarea
            value={description}
            rows={3}
            placeholder="Add a description..."
            onChange={(e) => setDescription(e.target.value)}
            className="w-full resize-y border border-border bg-surface text-sm leading-relaxed text-text outline-none placeholder:text-text-subtle focus:border-accent focus:ring-1 focus:ring-accent rounded-md p-3"
          />
          {setEditing && (
            <div className="flex items-center gap-2">
              <Button
                variant="accent"
                onClick={() => {
                  if (title.trim() && title !== task.title) onSave({ title: title.trim() });
                  if (description !== task.description) onSave({ description });
                  setEditing(false);
                }}
              >
                Save
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setTitle(task.title);
                  setDescription(task.description);
                  setEditing(false);
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
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
    <div className="mb-4 flex flex-col sm:flex-row items-start gap-1 sm:gap-4">
      <div className="w-full sm:w-24 shrink-0 sm:pt-1 text-sm font-semibold text-text">Properties</div>
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
    <div className="mb-4 flex flex-col sm:flex-row items-start gap-1 sm:gap-4">
      <div className="w-full sm:w-24 shrink-0 sm:pt-1 text-sm font-semibold text-text">Labels</div>
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
  const [file, setFile] = useState<File | null>(null);
  const [pending, setPending] = useState(false);
  const [previewResource, setPreviewResource] = useState<any | null>(null);

  function submit() {
    const trimmedName = name.trim();
    if (!trimmedName || !file) return;
    setPending(true);
    tasksService
      .addResource(task.id, { name: trimmedName, file })
      .then(() => {
        toast.success("Resource attached");
        setName("");
        setFile(null);
        setAdding(false);
      })
      .catch(() => toast.error("Couldn't attach resource"))
      .finally(() => setPending(false));
  }

  return (
    <div className="mb-4 flex flex-col sm:flex-row items-start gap-1 sm:gap-4">
      <div className="w-full sm:w-24 shrink-0 sm:pt-1 text-sm font-semibold text-text">Resources</div>
      <div className="min-w-0 flex-1 flex flex-col gap-2">
      {task.resources && task.resources.length > 0 && (
        <div className="flex flex-col gap-2">
          {task.resources.map((res) => {
            return (
              <div key={res.id} className="group flex items-center justify-between gap-2">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewResource(res)}
                    className="flex min-w-0 flex-1 items-center gap-2 text-sm text-text hover:text-accent transition-colors"
                  >
                    <Paperclip className="h-3.5 w-3.5 shrink-0 text-text-subtle" />
                    <span className="truncate">{res.name}</span>
                  </button>
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 p-1 text-text-subtle hover:text-accent transition-colors"
                    aria-label="Open in new tab"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
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
                    className="shrink-0 p-1 text-text-subtle opacity-0 transition-colors hover:text-red-500 group-hover:opacity-100"
                    aria-label="Remove resource"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
      <AttachmentPreviewModal
        open={!!previewResource}
        onClose={() => setPreviewResource(null)}
        resource={previewResource}
      />
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
                    setFile(null);
                  }}
                  className="flex h-7 w-7 items-center justify-center rounded-sm text-text-subtle hover:bg-surface-muted hover:text-text"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="h-8 min-w-0 flex-1 rounded-sm border border-border bg-surface px-2 text-sm text-text outline-none file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-accent file:text-white hover:file:bg-accent-hover"
                />
                <button
                  type="button"
                  onClick={submit}
                  disabled={pending || !name.trim() || !file}
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
      <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-3 shadow-[0px_1px_1px_0px_#0000000A,0px_3px_6px_-2px_#00000005]">
        {isLoading ? (
          <div className="h-20 animate-pulse rounded-lg bg-surface-muted" />
        ) : subtasks.length === 0 ? (
          <div className="rounded-md border border-dashed border-border p-3">
            <EmptyState title="No subtasks yet" />
            {isEditing && (
              <div className="mt-3">
                <InlineAddTaskRow
                  onAdd={(title) => addSubtask.mutate(title)}
                  pending={addSubtask.isPending}
                  label="Add a subtask..."
                />
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <TaskTable tasks={subtasks} visibleFields={DEFAULT_TASK_FIELDS} />
            {isEditing && (
              <div className="pt-2 border-t border-border">
                <InlineAddTaskRow
                  onAdd={(title) => addSubtask.mutate(title)}
                  pending={addSubtask.isPending}
                  label="Add a subtask..."
                />
              </div>
            )}
          </div>
        )}
      </div>
    </CollapsiblePanel>
  );
}
