"use client";

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  isWithinInterval,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarProps {
  month: Date;
  onMonthChange: (month: Date) => void;
  selectedStart: Date | null;
  selectedEnd: Date | null;
  onSelectDate: (date: Date) => void;
}

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

/**
 * Compact single-month calendar grid, per design_break_down.md §7
 * ("Su Mo Tu We Th Fr Sa" weekday labels, dark filled marker for the
 * selected date, light gray marker for the range/today state).
 */
export function Calendar({ month, onMonthChange, selectedStart, selectedEnd, onSelectDate }: CalendarProps) {
  const gridStart = startOfWeek(startOfMonth(month));
  const gridEnd = endOfWeek(endOfMonth(month));
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  return (
    <div className="w-[216px] p-2.5">
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => onMonthChange(subMonths(month, 1))}
          className="flex h-6 w-6 items-center justify-center rounded-sm text-text-muted hover:bg-surface-muted hover:text-text"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
        <span className="text-xs font-semibold text-text">{format(month, "MMMM yyyy")}</span>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => onMonthChange(addMonths(month, 1))}
          className="flex h-6 w-6 items-center justify-center rounded-sm text-text-muted hover:bg-surface-muted hover:text-text"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-y-1 text-center">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label} className="text-[11px] font-medium text-text-subtle">
            {label}
          </span>
        ))}

        {days.map((day) => {
          const inMonth = isSameMonth(day, month);
          const isStart = selectedStart && isSameDay(day, selectedStart);
          const isEnd = selectedEnd && isSameDay(day, selectedEnd);
          const inRange =
            selectedStart &&
            selectedEnd &&
            isWithinInterval(day, { start: selectedStart, end: selectedEnd });

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => onSelectDate(day)}
              className={cn(
                "flex h-6 w-6 items-center justify-center justify-self-center rounded-full text-[12px] transition-colors",
                !inMonth && "text-text-subtle/50",
                inMonth && !isStart && !isEnd && "text-text hover:bg-surface-muted",
                inRange && !isStart && !isEnd && "bg-accent-soft text-accent",
                (isStart || isEnd) && "bg-black-action font-medium text-white",
                isToday(day) && !isStart && !isEnd && "ring-1 ring-inset ring-border-strong",
              )}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
