import { Avatar } from "../../../../components/ui/avatar";
import { DateChip } from "../../../../components/ui/date-chip";
import type { Task } from "../../../../lib/types";

interface PropertiesRowProps {
  task: Task;
  onOpenDatePicker: () => void;
  dateAnchorRef: React.RefObject<HTMLDivElement>;
}

/** "Properties" row â€” reporter identity + due-date chip, per design_break_down.md Â§6. */
export function PropertiesRow({ task, onOpenDatePicker, dateAnchorRef }: PropertiesRowProps) {
  return (
    <div className="mb-4">
      <p className="mb-1.5 text-xs font-medium text-text-subtle">Properties</p>
      <div className="flex flex-wrap items-center gap-2">
        {task.reporter && (
          <div className="flex items-center gap-1.5 rounded-sm bg-surface-muted px-2 py-1 text-xs text-text-muted">
            <Avatar name={task.reporter.name} size="xs" />
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
