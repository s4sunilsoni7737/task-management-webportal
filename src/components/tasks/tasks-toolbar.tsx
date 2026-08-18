import { List, LayoutGrid, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { FieldsPopover } from "@/components/tasks/fields-popover";
import { FilterPopover, type TaskFilters } from "@/components/tasks/filter-popover";
import { TASK_FIELD_OPTIONS, type TaskFieldVisibility } from "@/components/tasks/task-fields";
import { cn } from "@/lib/utils";
import type { Label, Member } from "@/lib/types";

interface TasksToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  visibleFields: TaskFieldVisibility;
  onToggleField: (key: string) => void;
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
  members: Member[];
  labels: Label[];
  view?: "list" | "board";
  onViewChange?: (view: "list" | "board") => void;
  onAddTask: () => void;
}

export function TasksToolbar({
  search,
  onSearchChange,
  visibleFields,
  onToggleField,
  filters,
  onFiltersChange,
  members,
  labels,
  view,
  onViewChange,
  onAddTask,
}: TasksToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <SearchInput value={search} onChange={onSearchChange} placeholder="Search tasks..." />
      <FieldsPopover
        options={TASK_FIELD_OPTIONS}
        visible={visibleFields as unknown as Record<string, boolean>}
        onToggle={onToggleField}
        view={view}
        onViewChange={onViewChange}
      />
      <FilterPopover members={members} labels={labels} filters={filters} onChange={onFiltersChange} />
      <Button variant="accent" size="sm" onClick={onAddTask} className="h-8 rounded-md px-3 font-medium ml-1 mr-4">
        <Plus className="h-4 w-4 mr-1.5" />
        Add Task
      </Button>
    </div>
  );
}

interface ViewToggleProps {
  value: "list" | "board";
  onChange: (value: "list" | "board") => void;
}

/** List ↔ Board segmented toggle. */
function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div className="flex h-8 items-center rounded-sm border border-border bg-surface p-0.5">
      {([{ key: "list", label: "List", icon: List }, { key: "board", label: "Board", icon: LayoutGrid }] as const).map((opt) => (
        <button key={opt.key} type="button" onClick={() => onChange(opt.key)} className={cn("flex h-full items-center gap-1.5 rounded-[4px] px-2.5 text-sm font-medium transition-colors", value === opt.key ? "bg-surface-muted text-text" : "text-text-muted hover:text-text")}>
          <opt.icon className="h-3.5 w-3.5" />
          {opt.label}
        </button>
      ))}
    </div>
  );
}

