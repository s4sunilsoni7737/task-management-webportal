"use client";

import { useState } from "react";
import { parseISO } from "date-fns";
import { Popover } from "../../../../components/ui/popover";
import { Calendar } from "../../../../components/ui/calendar";

interface DatePickerPopoverProps {
  open: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement>;
  startDate: string | null;
  endDate: string | null;
  onChange: (range: { startDate: string; endDate: string }) => void;
}

/**
 * Date range popover for the Details panel Dates field, per
 * design_break_down.md Â§7. First click sets the range start; a second
 * click on a later date sets the end and closes the picker (matching
 * "close on selection" from the interaction requirements).
 */
export function DatePickerPopover({
  open,
  onClose,
  anchorRef,
  startDate,
  endDate,
  onChange,
}: DatePickerPopoverProps) {
  const initialMonth = endDate ? parseISO(endDate) : startDate ? parseISO(startDate) : new Date();
  const [month, setMonth] = useState(initialMonth);
  const [pendingStart, setPendingStart] = useState<Date | null>(startDate ? parseISO(startDate) : null);

  const selectedStart = pendingStart;
  const selectedEnd = endDate ? parseISO(endDate) : null;

  function handleSelect(day: Date) {
    if (!pendingStart || (selectedEnd && day < pendingStart)) {
      setPendingStart(day);
      onChange({ startDate: toIso(day), endDate: toIso(day) });
      return;
    }

    if (day < pendingStart) {
      onChange({ startDate: toIso(day), endDate: toIso(pendingStart) });
    } else {
      onChange({ startDate: toIso(pendingStart), endDate: toIso(day) });
    }
    setPendingStart(null);
    onClose();
  }

  return (
    <Popover open={open} onClose={onClose} anchorRef={anchorRef} align="start" className="p-0">
      <Calendar
        month={month}
        onMonthChange={setMonth}
        selectedStart={selectedStart}
        selectedEnd={selectedEnd}
        onSelectDate={handleSelect}
      />
    </Popover>
  );
}

function toIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}
