import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { SearchInput } from "../ui/search-input";
import { FieldsPopover } from "../ui/fields-popover";
import { FilterPopover, type TaskFilters } from "../ui/filter-popover";
import { ViewToggle } from "./view-toggle";
import { TASK_FIELD_OPTIONS, type TaskFieldVisibility } from "./task-fields";
import type { Label, Member } from "../../lib/types";

interface TasksToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  visibleFields: TaskFieldVisibility;
  onToggleField: (key: string) => void;
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
  members: Member[];
  labels: Label[];
  view: "list" | "board";
  onViewChange: (view: "list" | "board") => void;
  onAddTask: () => void;
}

/** Shared toolbar for both List and Board views, per Scope of Work §3.4. */
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
    <>
      <SearchInput value={search} onChange={onSearchChange} placeholder="Search tasks..." />
      <FieldsPopover
        options={TASK_FIELD_OPTIONS}
        visible={visibleFields as unknown as Record<string, boolean>}
        onToggle={onToggleField}
      />
      <FilterPopover members={members} labels={labels} filters={filters} onChange={onFiltersChange} />
      <ViewToggle value={view} onChange={onViewChange} />
      <Button variant="black" size="sm" onClick={onAddTask}>
        <Plus className="h-3.5 w-3.5" />
        Add Task
      </Button>
    </>
  );
}
