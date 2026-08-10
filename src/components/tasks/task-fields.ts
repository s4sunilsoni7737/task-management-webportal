import type { FieldOption } from "@/components/tasks/fields-popover";

export interface TaskFieldVisibility {
  priority: boolean;
  members: boolean;
  dueDate: boolean;
  labels: boolean;
  status: boolean;
  reporter: boolean;
}

export const DEFAULT_TASK_FIELDS: TaskFieldVisibility = {
  priority: true,
  members: true,
  dueDate: true,
  labels: false,
  status: false,
  reporter: false,
};

/** Options rendered inside FieldsPopover for the Tasks toolbar. */
export const TASK_FIELD_OPTIONS: FieldOption[] = [
  { key: "priority", label: "Priority" },
  { key: "members", label: "Members" },
  { key: "dueDate", label: "Due Date" },
  { key: "labels", label: "Labels" },
  { key: "status", label: "Status" },
  { key: "reporter", label: "Reporter" },
];
